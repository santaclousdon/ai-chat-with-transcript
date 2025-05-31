import { IsString, IsOptional, IsEnum } from 'class-validator';

export class ProcessTranscriptDto {
  @IsString()
  content: string;
}

export class CreateChatSessionDto {
  @IsString()
  transcriptId: string;
}

export class SendMessageDto {
  @IsString()
  sessionId: string;

  @IsString()
  question: string;
}

export class UpdateMessageFeedbackDto {
  @IsEnum(['positive', 'negative'])
  feedback: 'positive' | 'negative';
}

export interface ChatSession {
  id: string;
  transcriptId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: 'positive' | 'negative';
  createdAt: Date;
  updatedAt: Date;
}

export class ChatMessageDto {
  sessionId: string;
  message: string;
}

export class ChatResponseDto {
  message: ChatMessage;
  session: ChatSession;
}

export class UploadTranscriptDto {
  filename: string;
  content: string;
} 