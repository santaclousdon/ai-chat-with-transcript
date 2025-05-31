export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  feedback?: "positive" | "negative" | null
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export interface Transcript {
  id: string
  title: string
  content: string
  duration: string
  uploadedAt: Date
}

export type AppState = "initial" | "chat"
