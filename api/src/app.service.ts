import { Injectable } from '@nestjs/common';
import { db } from './db/db';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(): Promise<string> {
    const users = await db.selectFrom('users').selectAll().execute();
    return JSON.stringify(users);
  }

  async getTranscript(): Promise<string> {
    const transcriptPath = path.join(__dirname, '..', 'data', 'transcript.txt');
    try {
      return await fs.readFile(transcriptPath, 'utf-8');
    } catch {
      throw new Error('Failed to read transcript file');
    }
  }
}
