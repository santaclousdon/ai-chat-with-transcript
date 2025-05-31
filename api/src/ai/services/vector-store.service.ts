import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import type { VectorStore } from '../../ai/types/types';

@Injectable()
export class VectorStoreService implements OnModuleInit {
  private readonly logger = new Logger(VectorStoreService.name);
  private readonly client: QdrantClient;
  // Configuration for the vector store collection
  private readonly config: VectorStore.Config = {
    collectionName: 'transcript_chunks',
    vectorSize: 384,
    distance: 'Cosine',
  };

  constructor(private readonly configService: ConfigService) {
    this.client = new QdrantClient({
      url: this.configService.get<string>('QDRANT_URL'),
      apiKey: this.configService.get<string>('QDRANT_API_KEY'),
    });
  }

  async onModuleInit() {
    await this.init();
  }

  // Initialize vector store and create collection if it doesn't exist
  async init() {
    try {
      this.logger.log('Initializing vector store...');
      const collections = await this.client.getCollections();
      this.logger.log(`Found ${collections.collections.length} collections`);
      
      const exists = collections.collections.some(c => c.name === this.config.collectionName);
      this.logger.log(`Collection ${this.config.collectionName} exists: ${exists}`);

      if (!exists) {
        this.logger.log(`Creating collection: ${this.config.collectionName}`);
        const collectionConfig: VectorStore.CollectionConfig = {
          vectors: {
            size: this.config.vectorSize,
            distance: this.config.distance,
          },
        };

        await this.client.createCollection(this.config.collectionName, collectionConfig);
        this.logger.log(`Successfully created collection: ${this.config.collectionName}`);
      } else {
        this.logger.log(`Collection ${this.config.collectionName} already exists`);
      }
    } catch (error) {
      this.logger.error('Failed to initialize vector store:', error);
      throw error;
    }
  }

  // Store transcript chunks as vectors with metadata
  async upsertPoints(transcriptId: string, points: VectorStore.Point[]) {
    try {
      await this.client.upsert(this.config.collectionName, {
        points: points.map(point => ({
          id: point.id,
          vector: point.vector,
          payload: {
            transcript_id: transcriptId,
            content: point.content,
            metadata: point.metadata,
          },
        })),
      });
    } catch (error) {
      this.logger.error('Failed to upsert points:', error);
      throw error;
    }
  }

  // Search for similar vectors using cosine similarity
  async searchSimilar(queryVector: number[], limit: number = 5): Promise<VectorStore.SearchResult[]> {
    try {
      const result = await this.client.search(this.config.collectionName, {
        vector: queryVector,
        limit,
      });

      return result.map(point => {
        const payload = point.payload as { 
          content: string; 
          transcript_id: string;
          metadata: { timestamp?: string; speaker?: string; }
        };
        
        if (!payload || !payload.content) {
          throw new Error('Search result point has no content in payload');
        }

        return {
          id: String(point.id),
          score: point.score,
          content: payload.content,
          metadata: {
            transcript_id: payload.transcript_id,
            timestamp: payload.metadata?.timestamp,
            speaker: payload.metadata?.speaker,
          },
        };
      });
    } catch (error) {
      this.logger.error('Failed to search similar vectors:', error);
      throw error;
    }
  }

  // Delete all vectors associated with a transcript
  async deleteTranscript(transcriptId: string) {
    try {
      await this.client.delete(this.config.collectionName, {
        filter: {
          must: [
            {
              key: 'transcript_id',
              match: { value: transcriptId },
            },
          ],
        },
      });
    } catch (error) {
      this.logger.error('Failed to delete transcript vectors:', error);
      throw error;
    }
  }
}
