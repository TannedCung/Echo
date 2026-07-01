import { z } from "zod";

import { auth } from "@/auth";
import { writingScorerAgent } from "@/lib/ai/agents/writing-scorer-agent";
import { writingScoringSchema } from "@/lib/ai/writing-scoring-schema";
import { isDbConfigured } from "@/lib/db/client";
import { persistWritingSubmission } from "@/lib/db/queries/writing";
import { countWords } from "@/lib/ielts/writing-descriptors";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  task: z.enum(["task1", "task2"]),
  promptId: z.string().min(1),
  prompt: z.string().min(1),
  response: z.string().min(1),
});

/**
 * Scores a completed writing task against the four IELTS Writing criteria. The
 * Mastra writing-scorer agent returns Zod-validated structured output; when a
 * database is configured the submission and its scores are persisted and the
 * submission id is returned so the client can open the annotated report.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { task, promptId, prompt, response } = parsed.data;

  const wordCount = countWords(response);
  if (wordCount < 20) {
    return Response.json(
      { error: "There's not much to score yet — write a bit more and try again." },
      { status: 400 },
    );
  }

  const taskLabel = task === "task1" ? "Task 1 (150-word report)" : "Task 2 (250-word essay)";

  let scoring;
  try {
    const result = await writingScorerAgent.generate(
      [
        {
          role: "user",
          content: `Assess this IELTS Writing ${taskLabel} response (${wordCount} words).\n\nTASK PROMPT:\n${prompt}\n\nCANDIDATE'S RESPONSE:\n${response}`,
        },
      ],
      { structuredOutput: { schema: writingScoringSchema } },
    );
    scoring = result.object;
  } catch (error) {
    return Response.json({ error: `Scoring failed: ${(error as Error).message}` }, { status: 502 });
  }

  // Persist best-effort: a storage hiccup should never lose the learner's score.
  let submissionId: string | null = null;
  if (isDbConfigured) {
    try {
      submissionId = await persistWritingSubmission({
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        isGuest: session.user.isGuest,
        task,
        promptId,
        prompt,
        response,
        wordCount,
        scoring,
      });
    } catch (error) {
      console.error("Failed to persist writing submission:", error);
    }
  }

  return Response.json({ submissionId, scoring });
}
