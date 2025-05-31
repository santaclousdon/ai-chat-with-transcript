import type React from "react"
import ChatSidebar from "./ChatSidebar"
import ChatInterface from "./ChatInterface"
import TranscriptPanel from "./TranscriptPanel"
import type { ChatSession, Transcript } from "../types"

interface ChatScreenProps {
  chatSessions: ChatSession[]
  activeChatId: string | null
  transcript: Transcript
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onSendMessage: (content: string) => void
  onBackToInitial: () => void
  onProvideFeedback?: (messageId: string, feedback: "positive" | "negative" | null) => void
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  chatSessions,
  activeChatId,
  transcript,
  onNewChat,
  onSelectChat,
  onSendMessage,
  onBackToInitial,
  onProvideFeedback,
}) => {
  const activeChat = chatSessions.find((chat) => chat.id === activeChatId)
  const messages = activeChat?.messages || []

  return (
    <div className="h-screen flex">
      <ChatSidebar
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onNewChat={onNewChat}
        onSelectChat={onSelectChat}
        onBackToInitial={onBackToInitial}
      />

      <ChatInterface messages={messages} onSendMessage={onSendMessage} onProvideFeedback={onProvideFeedback} />

      <TranscriptPanel transcript={transcript} />
    </div>
  )
}

export default ChatScreen
