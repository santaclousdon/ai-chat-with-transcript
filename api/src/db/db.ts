import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export interface Database {
  transcripts: {
    id: string;
    title: string;
    filename: string;
    created_at: Date;
    updated_at: Date;
  };
  chat_sessions: {
    id: string;
    transcript_id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
  };
  messages: {
    id: string;
    session_id: string;
    role: 'user' | 'assistant';
    content: string;
    feedback?: 'positive' | 'negative';
    created_at: Date;
    updated_at: Date;
  };
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
