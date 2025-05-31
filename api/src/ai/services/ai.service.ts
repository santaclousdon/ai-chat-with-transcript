import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { v4 as uuidv4 } from 'uuid';
import { VectorStoreService } from './vector-store.service';
import { EmbeddingService } from './embedding.service';
import { QUESTION_ANSWERING_PROMPT, TITLE_GENERATION_PROMPT, formatContext } from '../prompts/prompts';
import type { AI, VectorStore } from '../../ai/types/types';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;
  // Split text into chunks for processing
  private readonly textSplitter: RecursiveCharacterTextSplitter;

  constructor(
    private readonly configService: ConfigService,
    private readonly vectorStore: VectorStoreService,
    private readonly embeddingService: EmbeddingService,
  ) {
    this.openai = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      temperature: 0.7,
    });

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  // Process transcript by splitting into chunks and storing embeddings
  async processTranscript(content: string): Promise<string> {
    try {
      const transcriptId = uuidv4();
      const chunks = await this.textSplitter.createDocuments([content]);

      // Extract metadata from content
      const points: VectorStore.Point[] = await Promise.all(
        chunks.map(async (chunk) => {
          const embedding = await this.embeddingService.generateEmbedding(chunk.pageContent);
          
          // Extract timestamp and speaker from content if available
          const metadata = this.extractMetadata(chunk.pageContent);

          return {
            id: uuidv4(),
            vector: embedding,
            content: chunk.pageContent,
            metadata,
          };
        })
      );

      await this.vectorStore.upsertPoints(transcriptId, points);
      return transcriptId;
    } catch (error) {
      this.logger.error('Failed to process transcript:', error);
      throw error;
    }
  }

  // Extract metadata from transcript content
  private extractMetadata(content: string): { timestamp?: string; speaker?: string } {
    const metadata: { timestamp?: string; speaker?: string } = {};
    
    // Extract speaker if present in format [Speaker:X]
    const speakerMatch = content.match(/\[Speaker:(\d+)\]/);
    if (speakerMatch) {
      metadata.speaker = `Speaker ${speakerMatch[1]}`;
    }

    // Extract timestamp if present in format [00:00:00]
    const timestampMatch = content.match(/\[(\d{2}:\d{2}:\d{2})\]/);
    if (timestampMatch) {
      metadata.timestamp = timestampMatch[1];
    }

    return metadata;
  }

  // Answer questions using context from similar transcript chunks
  async answerQuestion(content: string, chatHistory?: string): Promise<AI.QuestionResponse> {
    try {
      // Get question embedding
      const questionEmbedding = await this.embeddingService.generateEmbedding(content);

      // Search for relevant chunks
      const similarChunks = await this.vectorStore.searchSimilar(
        questionEmbedding,
        5
      );

      // Combine relevant chunks
      const context = similarChunks
        .map(chunk => chunk.content)
        .join('\n\n');

      // Generate response
      const response = await this.openai.invoke(
        `${QUESTION_ANSWERING_PROMPT}\n\nContext:\n${formatContext([context])}\n\nQuestion: ${content}\n\nChat History:\n${chatHistory || ''}\n\nAnswer:`
      );

      // Create citations from similar chunks
      const citations: AI.Citation[] = similarChunks.map(chunk => ({
        source: chunk.metadata.transcript_id,
        chunk: chunk.content,
        timestamp: chunk.metadata.timestamp || '00:00:00',
        speaker: chunk.metadata.speaker || 'Unknown',
        confidence: chunk.score,
      }));

      return {
        answer: response.trim(),
        citations,
      };
    } catch (error) {
      this.logger.error('Failed to answer question:', error);
      throw error;
    }
  }

  // Generate a title for the transcript
  async generateSessionTitle(transcriptContent: string): Promise<AI.TitleResponse> {
    try {
      const response = await this.openai.invoke(
        `${TITLE_GENERATION_PROMPT}\n\nTranscript:\n${transcriptContent}\n\nTitle:`
      );
      return { title: response.trim() };
    } catch (error) {
      this.logger.error('Failed to generate session title:', error);
      throw error;
    }
  }
} 