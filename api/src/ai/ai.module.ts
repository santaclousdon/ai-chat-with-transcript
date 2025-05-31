import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from '../db/db.module';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';
import { VectorStoreService } from './services/vector-store.service';
import { ChatService } from './services/chat.service';
import { TranscriptService } from './services/transcript.service';
import { EmbeddingService } from './services/embedding.service';

@Module({
  imports: [ConfigModule, DbModule],
  controllers: [AiController],
  providers: [
    {
      provide: AiService,
      useFactory: (configService: ConfigService, vectorStore: VectorStoreService, embeddingService: EmbeddingService) => 
        new AiService(configService, vectorStore, embeddingService),
      inject: [ConfigService, VectorStoreService, EmbeddingService],
    },
    {
      provide: VectorStoreService,
      useFactory: (configService: ConfigService) => new VectorStoreService(configService),
      inject: [ConfigService],
    },
    {
      provide: ChatService,
      useFactory: (db) => new ChatService(db),
      inject: ['DATABASE'],
    },
    {
      provide: TranscriptService,
      useFactory: (db) => new TranscriptService(db),
      inject: ['DATABASE'],
    },
    {
      provide: EmbeddingService,
      useFactory: () => new EmbeddingService(),
      inject: [],
    },
  ],
  exports: [AiService],
})
export class AiModule {} 