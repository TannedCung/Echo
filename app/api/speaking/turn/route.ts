import type { ModelMessage } from "ai";
import { z } from "zod";

import { auth } from "@/auth";
import { examinerAgent } from "@/lib/ai/agents/examiner-agent";
import type { SpeakingMode } from "@/lib/ielts/examiner-flow";
import { questionsForMode } from "@/lib/ielts/question-bank";

export const runtime = "nodejs";
export const maxDuration = 60;

const turnSchema = z.object({
  mode: z.enum(["part1", "part2", "part3", "full_mock"]),
  /** How many candidate answers have been given so far (0 = opening turn). */
  turnIndex: z.number().int().min(0),
  history: z
    .array(z.object({ role: z.enum(["examiner", "candidate"]), text: z.string() }))
    .default([]),
});

/** Flattened ordered question list for a mode (prompt + its follow-ups). */
function questionScript(mode: SpeakingMode): string[] {
  return questionsForMode(mode).flatMap((item) => [item.prompt, ...item.followUps]);
}

/** Per-turn directive that steers the examiner to ask the right next question. */
function directorNote(mode: SpeakingMode, turnIndex: number): { note: string; complete: boolean } {
  const questions = questionScript(mode);
  const partLabel = mode === "full_mock" ? "Part 1" : mode.replace("part", "Part ");

  if (turnIndex >= questions.length) {
    return {
      note: `The ${partLabel} questions are finished. Warmly thank the candidate, tell them that's the end of this part and you'll prepare their feedback. Keep it to 1–2 sentences and do NOT ask another question.`,
      complete: true,
    };
  }

  const question = questions[turnIndex];
  if (turnIndex === 0) {
    return {
      note: `This is the very start of IELTS Speaking ${partLabel}. Greet the candidate warmly in one short sentence, then ask exactly this question: "${question}". Keep your whole reply to 2 sentences.`,
      complete: false,
    };
  }

  return {
    note: `Briefly and naturally acknowledge the candidate's previous answer in a few words, then ask exactly this question: "${question}". Keep your whole reply to 2 sentences.`,
    complete: false,
  };
}

/**
 * Streams the examiner's next utterance (Server-Sent Events). The examiner-flow
 * question bank steers which question to ask; the Mastra examiner agent phrases
 * it naturally given the conversation so far. The final SSE frame carries
 * `{ done, complete }` so the client knows whether the part is over.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = turnSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { mode, turnIndex, history } = parsed.data;
  const { note, complete } = directorNote(mode, turnIndex);

  const messages: ModelMessage[] = [
    ...history.map(
      (turn): ModelMessage =>
        turn.role === "examiner"
          ? { role: "assistant", content: turn.text }
          : { role: "user", content: turn.text },
    ),
    { role: "system", content: note },
  ];

  const encoder = new TextEncoder();
  const sse = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      try {
        const result = await examinerAgent.stream(messages);
        for await (const delta of result.textStream) {
          send({ delta });
        }
        send({ done: true, complete });
      } catch (error) {
        send({ error: (error as Error).message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
    },
  });
}
