import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { listeningAttempts, users, type ListeningAttempt } from "@/lib/db/schema";
import type { GradedQuestion } from "@/lib/ielts/objective-scoring";

export interface PersistListeningInput {
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
 * Persist a graded Listening attempt: ensure the user row exists (FK), then store
 * the attempt with its per-question grading. Returns the attempt id for the
 * report link.
 */
export async function persistListeningAttempt(input: PersistListeningInput): Promise<string> {
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
    .insert(listeningAttempts)
    .values({
      userId: input.userId,
      testId: input.testId,
      answers: input.perQuestion,
      rawScore: input.raw,
      total: input.total,
      band: input.band,
    })
    .returning({ id: listeningAttempts.id });

  return attempt.id;
}

export interface ListeningReport extends Omit<ListeningAttempt, "answers"> {
  answers: GradedQuestion[];
}

/** Load a listening attempt for its owner (scoped to userId), or null if missing. */
export async function getListeningReport(
  attemptId: string,
  userId: string,
): Promise<ListeningReport | null> {
  const db = getDb();
  const [attempt] = await db
    .select()
    .from(listeningAttempts)
    .where(and(eq(listeningAttempts.id, attemptId), eq(listeningAttempts.userId, userId)))
    .limit(1);

  if (!attempt) return null;
  return { ...attempt, answers: attempt.answers as GradedQuestion[] };
}

/** Recent listening attempts for a user, newest first. */
export async function getRecentListening(userId: string, limit = 5): Promise<ListeningAttempt[]> {
  const db = getDb();
  return db
    .select()
    .from(listeningAttempts)
    .where(eq(listeningAttempts.userId, userId))
    .orderBy(desc(listeningAttempts.createdAt))
    .limit(limit);
}
