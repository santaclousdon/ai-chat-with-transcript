import type { ChatSession, Transcript } from "../types"

export const mockTranscript: Transcript = {
  id: "transcript-1",
  title: "Product Strategy Meeting - Q4 2024",
  content: `[00:00] John: Welcome everyone to our Q4 product strategy meeting. Today we'll be discussing our roadmap for the next quarter and reviewing our current progress.

[00:32] Sarah: Thanks John. Let me start with our user engagement metrics. We've seen a 23% increase in daily active users over the past month, which is fantastic news.

[01:15] Mike: That's great Sarah. From the engineering perspective, we've successfully deployed the new authentication system and it's performing well. Response times have improved by 15%.

[02:03] Lisa: On the marketing side, our latest campaign has generated over 50,000 new sign-ups. The conversion rate from trial to paid subscription is currently at 18%.

[02:45] John: Excellent work everyone. Now let's discuss our priorities for Q4. I think we should focus on three main areas: mobile optimization, AI integration, and customer support improvements.

[03:20] Sarah: I agree with the mobile focus. Our mobile traffic has increased by 40% but our mobile conversion rate is still lagging behind desktop.

[04:10] Mike: For AI integration, I propose we start with automated customer support responses. We could implement a chatbot that handles common queries.

[04:55] Lisa: That would definitely help reduce our support ticket volume. We're currently handling about 200 tickets per day, and roughly 60% are repetitive questions.

[05:30] John: Perfect. Let's also discuss the timeline. Sarah, when can we have the mobile optimization ready?

[06:00] Sarah: I estimate we can have the first phase completed by mid-November, with full optimization by end of November.

[06:25] Mike: The AI chatbot integration should take about 6-8 weeks, so we're looking at early December for the initial release.

[07:10] Lisa: I'll coordinate with both teams to ensure our marketing materials are ready to promote these new features.

[07:40] John: Sounds like a solid plan. Let's schedule weekly check-ins to monitor progress. Any questions or concerns?

[08:15] Sarah: Just one thing - we should consider user testing for the mobile interface before the full rollout.

[08:35] Mike: Agreed. I'll set up a beta testing group for both mobile and AI features.

[09:00] John: Perfect. Thanks everyone for a productive meeting. Let's reconvene next week with progress updates.`,
  duration: "9:15",
  uploadedAt: new Date("2024-01-15T10:30:00"),
}

export const mockChatSessions: ChatSession[] = [
  {
    id: "chat-1",
    title: "Q4 Strategy Discussion",
    createdAt: new Date("2024-01-15T11:00:00"),
    messages: [
      {
        id: "msg-1",
        content: "What were the main topics discussed in this meeting?",
        role: "user",
        timestamp: new Date("2024-01-15T11:00:00"),
      },
      {
        id: "msg-2",
        content:
          "The main topics discussed in the Q4 product strategy meeting were:\n\n1. **User Engagement Metrics** - 23% increase in daily active users\n2. **Engineering Updates** - New authentication system deployed with 15% improved response times\n3. **Marketing Results** - 50,000 new sign-ups with 18% trial-to-paid conversion rate\n4. **Q4 Priorities** - Three focus areas:\n   - Mobile optimization\n   - AI integration (chatbot for customer support)\n   - Customer support improvements\n5. **Timeline Planning** - Mobile optimization by end of November, AI chatbot by early December",
        role: "assistant",
        timestamp: new Date("2024-01-15T11:00:30"),
      },
      {
        id: "msg-3",
        content: "What are the current support ticket statistics?",
        role: "user",
        timestamp: new Date("2024-01-15T11:02:00"),
      },
      {
        id: "msg-4",
        content:
          "According to Lisa in the meeting, the current support ticket statistics are:\n\n- **Daily Volume**: ~200 tickets per day\n- **Repetitive Queries**: Approximately 60% of tickets are repetitive questions\n\nThis high volume of repetitive questions is one of the reasons why the team is prioritizing AI integration with an automated chatbot to handle common queries.",
        role: "assistant",
        timestamp: new Date("2024-01-15T11:02:15"),
      },
    ],
  },
  {
    id: "chat-2",
    title: "Mobile Optimization Timeline",
    createdAt: new Date("2024-01-15T14:30:00"),
    messages: [
      {
        id: "msg-5",
        content: "When will the mobile optimization be completed?",
        role: "user",
        timestamp: new Date("2024-01-15T14:30:00"),
      },
      {
        id: "msg-6",
        content:
          "According to Sarah's timeline in the meeting:\n\n- **Phase 1**: Mid-November 2024\n- **Full Optimization**: End of November 2024\n\nShe also mentioned that mobile traffic has increased by 40%, but mobile conversion rates are still lagging behind desktop, which is why this is a priority for Q4.",
        role: "assistant",
        timestamp: new Date("2024-01-15T14:30:20"),
      },
    ],
  },
  {
    id: "chat-3",
    title: "AI Integration Details",
    createdAt: new Date("2024-01-15T16:45:00"),
    messages: [
      {
        id: "msg-7",
        content: "Tell me about the AI integration plans",
        role: "user",
        timestamp: new Date("2024-01-15T16:45:00"),
      },
      {
        id: "msg-8",
        content:
          "The AI integration plans discussed in the meeting include:\n\n**Primary Focus**: Automated customer support chatbot\n- **Purpose**: Handle common/repetitive queries\n- **Timeline**: 6-8 weeks development (early December 2024 release)\n- **Lead**: Mike (Engineering)\n\n**Expected Benefits**:\n- Reduce support ticket volume (currently 200/day)\n- Address the 60% of tickets that are repetitive questions\n- Improve customer support efficiency\n\n**Next Steps**: Mike will set up a beta testing group for the AI features before full rollout.",
        role: "assistant",
        timestamp: new Date("2024-01-15T16:45:25"),
      },
    ],
  },
  {
    id: "chat-4",
    title: "Marketing Campaign Results",
    createdAt: new Date("2024-01-16T09:15:00"),
    messages: [
      {
        id: "msg-9",
        content: "What were the marketing campaign results mentioned?",
        role: "user",
        timestamp: new Date("2024-01-16T09:15:00"),
      },
      {
        id: "msg-10",
        content:
          "Lisa shared these marketing campaign results:\n\n**New Sign-ups**: Over 50,000 new sign-ups generated\n**Conversion Rate**: 18% from trial to paid subscription\n\n**Additional Context**:\n- The team considers these results positive\n- Lisa will coordinate with engineering and product teams to ensure marketing materials are ready for the new features (mobile optimization and AI chatbot)\n- This performance supports the company's growth trajectory going into Q4",
        role: "assistant",
        timestamp: new Date("2024-01-16T09:15:18"),
      },
    ],
  },
]
