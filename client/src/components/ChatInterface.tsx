"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react"
import type { Message } from "../types"

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  onProvideFeedback?: (messageId: string, feedback: "positive" | "negative" | null) => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, onProvideFeedback }) => {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const messageContent = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      await onSendMessage(messageContent)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    })
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative" | null) => {
    if (onProvideFeedback) {
      onProvideFeedback(messageId, feedback)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg mb-2">Start a conversation</p>
              <p className="text-sm">Ask questions about the transcript to get started</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex items-center justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleFeedback(message.id, "positive")}
                        className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
                          message.feedback === "positive" ? "bg-green-100 text-green-600" : "text-gray-400"
                        }`}
                        title="Helpful"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, "negative")}
                        className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
                          message.feedback === "negative" ? "bg-red-100 text-red-600" : "text-gray-400"
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown size={14} />
                      </button>
                      <button
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-400"
                        title="Copy to clipboard"
                      >
                        {copiedMessageId === message.id ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Thinking...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the transcript..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
