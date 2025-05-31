import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private model: any = null;

  async onModuleInit() {
    await this.init();
  }

  // Initialize the sentence transformer model
  async init() {
    try {
      // Load the model
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      this.logger.log('Sentence transformer model loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load sentence transformer model:', error);
      throw error;
    }
  }

  // Generate embeddings for a text using the sentence transformer model
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.model) {
        throw new Error('Model not initialized. Call init() first.');
      }

      const output = await this.model(text, {
        pooling: 'mean',
        normalize: true,
      });

      return Array.from(output.data);
    } catch (error) {
      this.logger.error('Failed to generate embedding:', error);
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.model) {
      throw new Error('Model not initialized. Call init() first.');
    }

    try {
      const results = await Promise.all(
        texts.map(text => this.model(text, { pooling: 'mean', normalize: true }))
      );
      return results.map(result => Array.from(result.data));
    } catch (error) {
      this.logger.error('Failed to generate embeddings:', error);
      throw error;
    }
  }
}
