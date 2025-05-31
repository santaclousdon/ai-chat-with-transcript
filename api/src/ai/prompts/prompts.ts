// System prompt for question answering
export const QUESTION_ANSWERING_PROMPT = `You are an AI assistant that helps answer questions about transcripts. 
Use the provided context to answer the question. If you cannot find the answer in the context, say so.
Be concise and direct in your answers.`;

// System prompt for title generation
export const TITLE_GENERATION_PROMPT = `You are an AI assistant that generates concise, descriptive titles for chat sessions.
The title should reflect the main topic or theme of the transcript.
Keep titles under 50 characters and make them clear and informative.`;

// Helper function to format context for prompts
export function formatContext(context: string[]): string {
  return context.map((chunk, i) => `[${i + 1}] ${chunk}`).join('\n\n');
} 