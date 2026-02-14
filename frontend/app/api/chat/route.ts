import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { CHAT_SYSTEM_PROMPT } from '@/lib/constants';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: CHAT_SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: "I'm having trouble connecting. Want to try again?",
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
