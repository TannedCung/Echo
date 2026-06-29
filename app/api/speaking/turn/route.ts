import type { ModelMessage } from "ai";
import { z } from "zod";

import { auth } from "@/auth";
import { examinerAgent } from "@/lib/ai/agents/examiner-agent";
import { partLabel, planTurn, type ExaminerMove } from "@/lib/ielts/speaking-script";

export const runtime = "nodejs";
export const maxDuration = 60;

const turnSchema = z.object({
  mode: z.enum(["part1", "part2", "part3", "full_mock"]),
  /** How many candidate answers have been given so far (0 = opening turn). */
  turnIndex: z.number().int().min(0),
  /** Per-session id that pins which exam form from the library is used. */
  examSeed: z.string().optional(),
  history: z
    .array(z.object({ role: z.enum(["examiner", "candidate"]), text: z.string() }))
    .default([]),
});

/** Per-turn directive that steers the examiner to deliver the planned move. */
function directorNote(move: ExaminerMove, isFirst: boolean, partChanged: boolean): string {
  if (move.kind === "closing") {
    return "The session questions are finished. Warmly thank the candidate, tell them that's the end of the test and you'll prepare their feedback. Keep it to 1–2 sentences and do NOT ask another question.";
  }

  if (move.kind === "cue_card") {
    return [
      "It is now Part 2 — the long turn. In one short sentence, tell the candidate you're going to give them a topic to talk about for one to two minutes, and that they have one minute to prepare and can make notes.",
      `Then read out this exact cue card topic: "${move.prompt}".`,
      "Do NOT read the bullet points as separate questions and do NOT add your own questions. Keep your whole reply to 2–3 sentences.",
    ].join(" ");
  }

  const transition = partChanged
    ? `You are now moving into ${partLabel(move.part)}. Briefly signal the change in a few words, then `
    : "Briefly and naturally acknowledge the candidate's previous answer in a few words, then ";

  if (isFirst) {
    return `This is the very start of the IELTS Speaking test (${partLabel(move.part)}). Greet the candidate warmly in one short sentence, then ask exactly this question: "${move.text}". Keep your whole reply to 2 sentences.`;
  }

  return `${transition}ask exactly this question: "${move.text}". Keep your whole reply to 2 sentences.`;
}

/** Client-facing metadata so the UI can render cue cards and Part 2 timers. */
function moveMeta(move: ExaminerMove, partChanged: boolean) {
  if (move.kind === "closing") {
    return { kind: "closing" as const };
  }
  if (move.kind === "cue_card") {
    return {
      kind: "cue_card" as const,
      part: move.part,
      partChanged,
      topic: move.topic,
      cueCard: {
        prompt: move.prompt,
        bullets: move.bullets,
        prepSeconds: move.prepSeconds,
        talkSeconds: move.talkSeconds,
      },
    };
  }
  return { kind: "question" as const, part: move.part, partChanged, topic: move.topic };
}

/**
 * Streams the examiner's next utterance (Server-Sent Events). The flow planner
 * (lib/ielts/speaking-script) decides the move for this turn — a Part 1/3
 * question, the Part 2 cue card, or the closing — and the Mastra examiner agent
 * phrases it naturally. The first SSE frame carries `meta` (so the client can
 * render cue cards / timers); the final frame carries `{ done, complete }`.
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
  const { mode, turnIndex, examSeed, history } = parsed.data;
  const { move, complete, isFirst, partChanged } = planTurn(mode, turnIndex, examSeed);
  const note = directorNote(move, isFirst, partChanged);

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
        send({ meta: moveMeta(move, partChanged) });
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
