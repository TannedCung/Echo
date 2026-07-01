import { z } from "zod";

import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db/client";
import { persistReadingAttempt } from "@/lib/db/queries/reading";
import { gradeAnswers, rawToBand } from "@/lib/ielts/objective-scoring";
import { getReadingTest, READING_BAND_TABLE } from "@/lib/ielts/reading-tests";

export const runtime = "nodejs";

const bodySchema = z.object({
  testId: z.string().min(1),
  /** Map of questionId → the candidate's answer. */
  responses: z.record(z.string(), z.string()),
});

/**
 * Grades a Reading attempt. Grading happens on the server against the canonical
 * question bank — the client never sends or is trusted with correct answers.
 * Returns the per-question grading, raw score and converted band, persisting the
 * attempt when a database is configured.
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

  const test = getReadingTest(parsed.data.testId);
  if (!test) {
    return Response.json({ error: "Unknown reading test" }, { status: 404 });
  }

  const { perQuestion, raw, total } = gradeAnswers(test.questions, parsed.data.responses);
  const band = rawToBand(raw, total, READING_BAND_TABLE);

  let attemptId: string | null = null;
  if (isDbConfigured) {
    try {
      attemptId = await persistReadingAttempt({
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        isGuest: session.user.isGuest,
        testId: test.id,
        perQuestion,
        raw,
        total,
        band,
      });
    } catch (error) {
      console.error("Failed to persist reading attempt:", error);
    }
  }

  return Response.json({ attemptId, result: { perQuestion, raw, total, band } });
}
