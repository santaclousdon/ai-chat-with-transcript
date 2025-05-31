import { Controller, Post, Body, Get, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { ChatService } from '../services/chat.service';
import { TranscriptService } from '../services/transcript.service';
import { CreateChatSessionDto, SendMessageDto, UpdateMessageFeedbackDto, ChatSession, ChatMessage } from '../dto/chat.dto';
import { UploadTranscriptDto } from '../dto/transcript.dto';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly chatService: ChatService,
    private readonly transcriptService: TranscriptService,
  ) {}

  /**
   * Process a transcript: generate embeddings, create title, and store content
   * @param dto Contains transcript content and filename
   * @returns Object containing the transcript ID
   * @throws HttpException if processing fails
   */
  @Post('transcript')
  async processTranscript(@Body() dto: UploadTranscriptDto) {
    try {
      const transcriptId = await this.aiService.processTranscript(dto.content);
      const title = await this.aiService.generateSessionTitle(dto.content);
      await this.transcriptService.createTranscript(dto.content, title.title, dto.filename);
      return { transcriptId };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to process transcript',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get a transcript by ID with its content
   * @param id Transcript ID
   * @returns Transcript details including content
   * @throws HttpException if transcript not found or retrieval fails
   */
  @Get('transcript/:id')
  async getTranscript(@Param('id') id: string) {
    try {
      const transcript = await this.transcriptService.getTranscript(id);
      if (!transcript) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Transcript not found',
          message: `No transcript found with id: ${id}`
        }, HttpStatus.NOT_FOUND);
      }
      return transcript;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to get transcript',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new chat session for a transcript
   * @param dto Contains transcript ID
   * @returns Created chat session details
   * @throws HttpException if transcript not found or session creation fails
   */
  @Post('chat/session')
  async createChatSession(@Body() dto: CreateChatSessionDto): Promise<ChatSession> {
    try {
      const transcript = await this.transcriptService.getTranscript(dto.transcriptId);
      if (!transcript) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Transcript not found',
          message: `No transcript found with id: ${dto.transcriptId}`
        }, HttpStatus.NOT_FOUND);
      }
      
      return this.chatService.createSession(dto.transcriptId, transcript.title);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to create chat session',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Send a message in a chat session and get AI response
   * @param dto Contains session ID and question
   * @returns AI's response message
   * @throws HttpException if session/transcript not found or message sending fails
   */
  @Post('chat/message')
  async sendMessage(@Body() dto: SendMessageDto) {
    try {
      const session = await this.chatService.getSession(dto.sessionId);
      if (!session) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Session not found',
          message: `No chat session found with id: ${dto.sessionId}`
        }, HttpStatus.NOT_FOUND);
      }

      const transcript = await this.transcriptService.getTranscript(session.transcriptId);
      if (!transcript) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Transcript not found',
          message: `No transcript found with id: ${session.transcriptId}`
        }, HttpStatus.NOT_FOUND);
      }

      // Save user's question first
      await this.chatService.addMessage(dto.sessionId, 'user', dto.question);

      const messages = await this.chatService.getMessages(dto.sessionId);
      const chatHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      
      const { answer, citations } = await this.aiService.answerQuestion(
        dto.question,
        chatHistory
      );

      // Save AI's answer with citations
      const message = await this.chatService.addMessage(dto.sessionId, 'assistant', answer);
      
      return {
        ...message,
        citations,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to send message',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update feedback for a message (positive/negative)
   * @param id Message ID
   * @param dto Contains feedback type
   * @returns Updated message details
   * @throws HttpException if message not found or update fails
   */
  @Put('chat/message/:id/feedback')
  async updateMessageFeedback(
    @Param('id') id: string,
    @Body() dto: UpdateMessageFeedbackDto
  ) {
    try {
      const message = await this.chatService.updateMessageFeedback(id, dto.feedback);
      if (!message) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Message not found',
          message: `No message found with id: ${id}`
        }, HttpStatus.NOT_FOUND);
      }
      return message;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to update message feedback',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all chat sessions
   * @returns List of all chat sessions
   * @throws HttpException if retrieval fails
   */
  @Get('chat/sessions')
  async getAllSessions(): Promise<ChatSession[]> {
    try {
      const sessions = await this.chatService.getAllSessions();
      return sessions;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to get chat sessions',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all messages for a chat session
   * @param id Session ID
   * @returns List of messages in chronological order
   * @throws HttpException if session not found or retrieval fails
   */
  @Get('chat/session/:id/messages')
  async getSessionMessages(@Param('id') id: string): Promise<ChatMessage[]> {
    try {
      const session = await this.chatService.getSession(id);
      if (!session) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Session not found',
          message: `No chat session found with id: ${id}`
        }, HttpStatus.NOT_FOUND);
      }

      const messages = await this.chatService.getMessages(id);
      return messages;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to get session messages',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 