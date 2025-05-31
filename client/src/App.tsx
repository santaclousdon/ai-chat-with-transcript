"use client"

import { useState } from "react"
import InitialScreen from "./components/InitialScreen"
import ChatScreen from "./components/ChatScreen"
import type { AppState, ChatSession, Message, Transcript } from "./types"
import { mockChatSessions, mockTranscript } from "./data/mockData"

function App() {
  const [appState, setAppState] = useState<AppState>("initial")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatSessions)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<Transcript | null>(null)

  const handleUpload = () => {
    // In a real app, this would handle file upload
    // For now, we'll use the demo data
    setTranscript(mockTranscript)
    setAppState("chat")
    setActiveChatId(null)
  }

  const handleUseDemoData = () => {
    setTranscript(mockTranscript)
    setAppState("chat")
    setActiveChatId(null)
  }

  const handleNewChat = () => {
    setActiveChatId(null)
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId)
  }

  const handleSendMessage = async (content: string) => {
    if (!activeChatId) {
      // Create a new chat session
      const newChatId = `chat-${Date.now()}`
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        role: "user",
        timestamp: new Date(),
      }

      // Simulate AI response
      const aiResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        content: generateAIResponse(content),
        role: "assistant",
        timestamp: new Date(Date.now() + 1000),
      }

      const newChat: ChatSession = {
        id: newChatId,
        title: content.length > 50 ? content.substring(0, 50) + "..." : content,
        messages: [userMessage, aiResponse],
        createdAt: new Date(),
      }

      setChatSessions((prev) => [newChat, ...prev])
      setActiveChatId(newChatId)
    } else {
      // Add message to existing chat
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        role: "user",
        timestamp: new Date(),
      }

      const aiResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        content: generateAIResponse(content),
        role: "assistant",
        timestamp: new Date(Date.now() + 1000),
      }

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage, aiResponse] } : chat,
        ),
      )
    }
  }

  const handleProvideFeedback = (messageId: string, feedback: "positive" | "negative" | null) => {
    setChatSessions((prev) =>
      prev.map((chat) => ({
        ...chat,
        messages: chat.messages.map((message) => (message.id === messageId ? { ...message, feedback } : message)),
      })),
    )
  }

  const generateAIResponse = (userMessage: string): string => {
    // Simple mock AI response based on keywords
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("timeline") || lowerMessage.includes("when")) {
      return "Based on the transcript, here are the key timelines mentioned:\n\n- Mobile optimization: First phase by mid-November, full optimization by end of November\n- AI chatbot integration: 6-8 weeks development, early December release\n- Weekly check-ins scheduled to monitor progress"
    }

    if (lowerMessage.includes("metrics") || lowerMessage.includes("numbers")) {
      return "Here are the key metrics from the meeting:\n\n- 23% increase in daily active users\n- 15% improvement in response times\n- 50,000+ new sign-ups from marketing campaign\n- 18% trial-to-paid conversion rate\n- 200 support tickets per day (60% repetitive)"
    }

    if (lowerMessage.includes("mobile")) {
      return "Regarding mobile optimization:\n\n- Mobile traffic increased by 40%\n- Mobile conversion rates are lagging behind desktop\n- This is a Q4 priority\n- Timeline: First phase mid-November, completion end of November\n- User testing planned before full rollout"
    }

    if (lowerMessage.includes("ai") || lowerMessage.includes("chatbot")) {
      return "About the AI integration plans:\n\n- Focus on automated customer support chatbot\n- Will handle common/repetitive queries\n- 6-8 weeks development timeline\n- Early December release target\n- Beta testing group will be set up\n- Expected to reduce the 60% of repetitive support tickets"
    }

    if (lowerMessage.includes("support") || lowerMessage.includes("tickets")) {
      return "Current support statistics:\n\n- 200 tickets per day\n- 60% are repetitive questions\n- AI chatbot planned to handle common queries\n- This should significantly reduce support team workload"
    }

    return `I can help you find information from the transcript about "${userMessage}". The transcript covers a Q4 product strategy meeting discussing user metrics, engineering updates, marketing results, and plans for mobile optimization and AI integration. Could you be more specific about what you'd like to know?`
  }

  const handleBackToInitial = () => {
    setAppState("initial")
    setActiveChatId(null)
    setTranscript(null)
  }

  if (appState === "initial") {
    return <InitialScreen onUpload={handleUpload} onUseDemoData={handleUseDemoData} />
  }

  if (appState === "chat" && transcript) {
    return (
      <ChatScreen
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        transcript={transcript}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
        onBackToInitial={handleBackToInitial}
        onProvideFeedback={handleProvideFeedback}
      />
    )
  }

  return null
}

export default App
