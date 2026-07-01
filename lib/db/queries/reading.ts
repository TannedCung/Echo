import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { readingAttempts, users, type ReadingAttempt } from "@/lib/db/schema";
import type { GradedQuestion } from "@/lib/ielts/objective-scoring";

export interface PersistReadingInput {
  userId: string;
  name?: string | null;
  email?: string | null;
  isGuest?: boolean;
  testId: string;
  perQuestion: GradedQuestion[];
  raw: number;
  total: number;
  band: number;
}

/**
 * Persist a graded Reading attempt: ensure the user row exists (FK), then store
 * the attempt with its per-question grading. Returns the attempt id for the
 * report link.
 */
export async function persistReadingAttempt(input: PersistReadingInput): Promise<string> {
  const db = getDb();

  await db
    .insert(users)
    .values({
      id: input.userId,
      name: input.name ?? null,
      email: input.email ?? null,
      isGuest: input.isGuest ? 1 : 0,
    })
    .onConflictDoNothing({ target: users.id });

  const [attempt] = await db
    .insert(readingAttempts)
    .values({
      userId: input.userId,
      testId: input.testId,
      answers: input.perQuestion,
      rawScore: input.raw,
      total: input.total,
      band: input.band,
    })
    .returning({ id: readingAttempts.id });

  return attempt.id;
}

export interface ReadingReport extends Omit<ReadingAttempt, "answers"> {
  answers: GradedQuestion[];
}

/** Load a reading attempt for its owner (scoped to userId), or null if missing. */
export async function getReadingReport(
  attemptId: string,
  userId: string,
): Promise<ReadingReport | null> {
  const db = getDb();
  const [attempt] = await db
    .select()
    .from(readingAttempts)
    .where(and(eq(readingAttempts.id, attemptId), eq(readingAttempts.userId, userId)))
    .limit(1);

  if (!attempt) return null;
  return { ...attempt, answers: attempt.answers as GradedQuestion[] };
}

/** Recent reading attempts for a user, newest first. */
export async function getRecentReading(userId: string, limit = 5): Promise<ReadingAttempt[]> {
  const db = getDb();
  return db
    .select()
    .from(readingAttempts)
    .where(eq(readingAttempts.userId, userId))
    .orderBy(desc(readingAttempts.createdAt))
    .limit(limit);
}
