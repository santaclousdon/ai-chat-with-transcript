import { Injectable } from '@nestjs/common';
import { db } from './db/db';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTranscripts(): Promise<string> {
    const transcripts = await db.selectFrom('transcripts').selectAll().execute();
    return JSON.stringify(transcripts);
  }
}
