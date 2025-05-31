"use client"

import type React from "react"
import { Plus, MessageSquare, ArrowLeft } from "lucide-react"
import type { ChatSession } from "../types"

interface ChatSidebarProps {
  chatSessions: ChatSession[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onBackToInitial: () => void
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatSessions,
  activeChatId,
  onNewChat,
  onSelectChat,
  onBackToInitial,
}) => {
  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onBackToInitial}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-3"
        >
          <ArrowLeft size={18} />
          Back to Upload
        </button>

        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Chat History</h3>

          <div className="space-y-2">
            {chatSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  activeChatId === session.id ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{session.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{session.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
