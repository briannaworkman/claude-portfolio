import Anthropic from '@anthropic-ai/sdk';
import type { NextRequest } from 'next/server';
import { about } from '@/data/about';
import { RateLimiter } from '@/lib/terminal/rate-limiter';

const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60_000 });

function buildSystemPrompt(): string {
  const experience = about.experience
    .map((e) => `${e.role} at ${e.company} (${e.startDate}–${e.endDate}): ${e.description}`)
    .join('\n');

  const education = about.education
    .map((e) => `${e.degree} from ${e.institution}, ${e.graduationYear}`)
    .join('\n');

  return `You are answering questions on behalf of ${about.name}, a ${about.title}.
Answer in first person, in a friendly and professional tone.
Only answer questions related to ${about.name}'s professional background.
Never fabricate information — only state facts from the data below.
If asked something unrelated or unanswerable from the data, politely decline.

Bio: ${about.bio}

Experience:
${experience}

Education:
${education}

Interests: ${about.interests.join(', ')}`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

  if (!limiter.check(ip)) {
    return new Response('rate limit exceeded', { status: 429 });
  }

  let body: { question?: string };
  try {
    body = await req.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const question = body.question ?? '';

  if (typeof question !== 'string' || question.length === 0) {
    return new Response('question is required', { status: 400 });
  }

  if (question.length > 500) {
    return new Response('question too long', { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('server misconfiguration', { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: buildSystemPrompt(),
    messages: [{ role: 'user', content: question }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
