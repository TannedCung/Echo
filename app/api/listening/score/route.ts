import { z } from "zod";

import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db/client";
import { persistListeningAttempt } from "@/lib/db/queries/listening";
import { getListeningTest, LISTENING_BAND_TABLE } from "@/lib/ielts/listening-tests";
import { gradeAnswers, rawToBand } from "@/lib/ielts/objective-scoring";

export const runtime = "nodejs";

const bodySchema = z.object({
  testId: z.string().min(1),
  /** Map of questionId → the candidate's answer. */
  responses: z.record(z.string(), z.string()),
});

/**
 * Grades a Listening attempt. Grading happens on the server against the canonical
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

  const test = getListeningTest(parsed.data.testId);
  if (!test) {
    return Response.json({ error: "Unknown listening test" }, { status: 404 });
  }

  const { perQuestion, raw, total } = gradeAnswers(test.questions, parsed.data.responses);
  const band = rawToBand(raw, total, LISTENING_BAND_TABLE);

  let attemptId: string | null = null;
  if (isDbConfigured) {
    try {
      attemptId = await persistListeningAttempt({
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
      console.error("Failed to persist listening attempt:", error);
    }
  }

  // The transcript is returned only now, with the result, so it can be revealed
  // for study without ever being shipped to the browser during the test.
  return Response.json({
    attemptId,
    result: { perQuestion, raw, total, band },
    transcript: test.transcript,
  });
}
