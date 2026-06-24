import { z } from "zod";

import { auth } from "@/auth";
import { scorerAgent } from "@/lib/ai/agents/scorer-agent";
import { scoringSchema } from "@/lib/ai/scoring-schema";
import { isDbConfigured } from "@/lib/db/client";
import { persistScoredSession } from "@/lib/db/queries/sessions";

export const runtime = "nodejs";
export const maxDuration = 60;

const scoreSchema = z.object({
  mode: z.enum(["part1", "part2", "part3", "full_mock"]),
  turns: z
    .array(
      z.object({
        role: z.enum(["examiner", "candidate"]),
        text: z.string(),
        audioUrl: z.string().url().nullish(),
      }),
    )
    .min(1),
});

/** Render the conversation as a labelled transcript for the scorer. */
function toTranscript(turns: { role: string; text: string }[]): string {
  return turns
    .map((t) => `${t.role === "examiner" ? "Examiner" : "Candidate"}: ${t.text}`)
    .join("\n\n");
}

/**
 * Scores a completed speaking session against the four IELTS criteria. The
 * Mastra scorer agent returns Zod-validated structured output; when a database
 * is configured the session, its turns, and the scores are persisted and the
 * report id is returned so the client can navigate to the annotated report.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = scoreSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { mode, turns } = parsed.data;

  const candidateTurns = turns.filter((t) => t.role === "candidate" && t.text.trim());
  if (candidateTurns.length === 0) {
    return Response.json(
      { error: "There's nothing to score yet — try answering a question first." },
      { status: 400 },
    );
  }

  let scoring;
  try {
    const result = await scorerAgent.generate(
      [
        {
          role: "user",
          content: `Here is the full transcript of an IELTS Speaking ${mode} session. Assess the candidate.\n\n${toTranscript(turns)}`,
        },
      ],
      { structuredOutput: { schema: scoringSchema } },
    );
    scoring = result.object;
  } catch (error) {
    return Response.json({ error: `Scoring failed: ${(error as Error).message}` }, { status: 502 });
  }

  // Persist best-effort: a storage hiccup should never lose the learner's score.
  let sessionId: string | null = null;
  if (isDbConfigured) {
    try {
      sessionId = await persistScoredSession({
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        isGuest: session.user.isGuest,
        mode,
        turns,
        scoring,
      });
    } catch (error) {
      console.error("Failed to persist scored session:", error);
    }
  }

  return Response.json({ sessionId, scoring });
}
