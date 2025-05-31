import { IsString } from 'class-validator';

export interface Transcript {
  id: string;
  title: string;
  filename: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UploadTranscriptDto {
  @IsString()
  filename: string;

  @IsString()
  content: string;
} 