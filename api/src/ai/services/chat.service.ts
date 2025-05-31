import { Injectable, Logger } from '@nestjs/common';
import { Kysely } from 'kysely';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../../db/db';
import { ChatSession, ChatMessage, UpdateMessageFeedbackDto } from '../dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly db: Kysely<Database>) {}

  // Create a new chat session for a transcript
  async createSession(transcriptId: string, title: string): Promise<ChatSession> {
    const id = uuidv4();
    const session = await this.db
      .insertInto('chat_sessions')
      .values({
        id,
        transcript_id: transcriptId,
        title,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirst();

    if (!session) {
      throw new Error('Failed to create chat session');
    }

    return {
      id: session.id,
      transcriptId: session.transcript_id,
      title: session.title,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    };
  }

  // Get a specific chat session by ID
  async getSession(sessionId: string): Promise<ChatSession | null> {
    const session = await this.db
      .selectFrom('chat_sessions')
      .where('id', '=', sessionId)
      .selectAll()
      .executeTakeFirst();

    if (!session) return null;

    return {
      id: session.id,
      transcriptId: session.transcript_id,
      title: session.title,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    };
  }

  // Add a message to a chat session (user or assistant)
  async addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage> {
    const id = uuidv4();
    const message = await this.db
      .insertInto('messages')
      .values({
        id,
        session_id: sessionId,
        role,
        content,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirst();

    if (!message) {
      throw new Error('Failed to add message');
    }

    return {
      id: message.id,
      sessionId: message.session_id,
      role: message.role,
      content: message.content,
      feedback: message.feedback,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    };
  }

  // Get all messages for a chat session
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const messages = await this.db
      .selectFrom('messages')
      .where('session_id', '=', sessionId)
      .orderBy('created_at', 'asc')
      .selectAll()
      .execute();

    return messages.map(message => ({
      id: message.id,
      sessionId: message.session_id,
      role: message.role,
      content: message.content,
      feedback: message.feedback,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    }));
  }

  // Update feedback for a message (positive/negative)
  async updateMessageFeedback(messageId: string, feedback: 'positive' | 'negative'): Promise<ChatMessage> {
    const message = await this.db
      .updateTable('messages')
      .set({
        feedback,
        updated_at: new Date(),
      })
      .where('id', '=', messageId)
      .returningAll()
      .executeTakeFirst();

    if (!message) {
      throw new Error('Failed to update message feedback');
    }

    return {
      id: message.id,
      sessionId: message.session_id,
      role: message.role,
      content: message.content,
      feedback: message.feedback,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    };
  }

  // Get all chat sessions
  async getAllSessions(): Promise<ChatSession[]> {
    const sessions = await this.db
      .selectFrom('chat_sessions')
      .selectAll()
      .execute();

    return sessions.map(session => ({
      id: session.id,
      transcriptId: session.transcript_id,
      title: session.title,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    }));
  }
} 