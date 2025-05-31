import { Injectable, Logger } from '@nestjs/common';
import { Kysely } from 'kysely';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../../db/db';
import { Transcript } from '../dto/transcript.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TranscriptService {
  private readonly logger = new Logger(TranscriptService.name);
  private readonly dataDir = path.join(process.cwd(), 'data', 'transcripts');

  constructor(private readonly db: Kysely<Database>) {
    this.ensureDataDir();
  }

  // Ensure data directory exists for storing transcript files
  private async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create data directory:', error);
    }
  }

  // Create a new transcript with content stored in file and metadata in database
  async createTranscript(content: string, title: string, filename: string): Promise<Transcript> {
    const id = uuidv4();
    const filePath = path.join(this.dataDir, `${id}.txt`);

    try {
      // Save content to file
      await fs.writeFile(filePath, content, 'utf-8');

      // Save metadata to database
      const transcript = await this.db
        .insertInto('transcripts')
        .values({
          id,
          title,
          filename,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirst();

      if (!transcript) {
        // Clean up file if DB insert fails
        await fs.unlink(filePath);
        throw new Error('Failed to create transcript');
      }

      return {
        id: transcript.id,
        title: transcript.title,
        filename: transcript.filename,
        createdAt: transcript.created_at,
        updatedAt: transcript.updated_at,
      };
    } catch (error) {
      // Clean up file if anything fails
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        this.logger.error('Failed to clean up file after error:', unlinkError);
      }
      throw error;
    }
  }

  // Get a transcript by ID with its content from file
  async getTranscript(id: string): Promise<Transcript | null> {
    const transcript = await this.db
      .selectFrom('transcripts')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!transcript) return null;

    try {
      const filePath = path.join(this.dataDir, `${id}.txt`);
      const content = await fs.readFile(filePath, 'utf-8');

      return {
        id: transcript.id,
        title: transcript.title,
        filename: transcript.filename,
        content,
        createdAt: transcript.created_at,
        updatedAt: transcript.updated_at,
      };
    } catch (error) {
      this.logger.error(`Failed to read transcript file for id ${id}:`, error);
      throw error;
    }
  }

  // Delete a transcript and its associated file
  async deleteTranscript(id: string): Promise<void> {
    try {
      // Delete from database
      await this.db
        .deleteFrom('transcripts')
        .where('id', '=', id)
        .execute();

      // Delete file
      const filePath = path.join(this.dataDir, `${id}.txt`);
      await fs.unlink(filePath);
    } catch (error) {
      this.logger.error(`Failed to delete transcript ${id}:`, error);
      throw error;
    }
  }
} 