import { and, desc, eq } from "drizzle-orm";

import type { WritingScoringResult } from "@/lib/ai/writing-scoring-schema";
import { getDb } from "@/lib/db/client";
import {
  users,
  writingScores,
  writingSubmissions,
  type WritingScore,
  type WritingSubmission,
} from "@/lib/db/schema";
import type { WritingTaskType } from "@/lib/ielts/writing-descriptors";

export interface PersistWritingInput {
  userId: string;
  name?: string | null;
  email?: string | null;
  isGuest?: boolean;
  task: WritingTaskType;
  promptId: string;
  prompt: string;
  response: string;
  wordCount: number;
  scoring: WritingScoringResult;
}

/**
 * Persist a finished, scored writing submission: ensure the user row exists (FK),
 * store the submission, then its four-criteria scores. Returns the submission id
 * so the caller can link to the report. Mirrors persistScoredSession for
 * Speaking; the Neon HTTP driver sequences writes rather than using a transaction.
 */
export async function persistWritingSubmission(input: PersistWritingInput): Promise<string> {
  const db = getDb();
  const { scoring } = input;

  await db
    .insert(users)
    .values({
      id: input.userId,
      name: input.name ?? null,
      email: input.email ?? null,
      isGuest: input.isGuest ? 1 : 0,
    })
    .onConflictDoNothing({ target: users.id });

  const [submission] = await db
    .insert(writingSubmissions)
    .values({
      userId: input.userId,
      task: input.task,
      promptId: input.promptId,
      prompt: input.prompt,
      response: input.response,
      wordCount: input.wordCount,
      overallBand: scoring.overall,
    })
    .returning({ id: writingSubmissions.id });

  const submissionId = submission.id;

  await db.insert(writingScores).values({
    submissionId,
    taskResponse: scoring.taskResponse.band,
    coherenceCohesion: scoring.coherenceCohesion.band,
    lexicalResource: scoring.lexicalResource.band,
    grammaticalRange: scoring.grammaticalRange.band,
    overall: scoring.overall,
    feedback: scoring,
  });

  return submissionId;
}

export interface WritingReport {
  submission: WritingSubmission;
  score: (Omit<WritingScore, "feedback"> & { feedback: WritingScoringResult }) | null;
}

/** Load a writing report for its owner (scoped to userId), or null if missing. */
export async function getWritingReport(
  submissionId: string,
  userId: string,
): Promise<WritingReport | null> {
  const db = getDb();

  const [submission] = await db
    .select()
    .from(writingSubmissions)
    .where(and(eq(writingSubmissions.id, submissionId), eq(writingSubmissions.userId, userId)))
    .limit(1);

  if (!submission) return null;

  const [score] = await db
    .select()
    .from(writingScores)
    .where(eq(writingScores.submissionId, submissionId))
    .limit(1);

  return {
    submission,
    score: score ? { ...score, feedback: score.feedback as WritingScoringResult } : null,
  };
}

/** Recent writing submissions for a user, newest first. */
export async function getRecentWriting(userId: string, limit = 5): Promise<WritingSubmission[]> {
  const db = getDb();
  return db
    .select()
    .from(writingSubmissions)
    .where(eq(writingSubmissions.userId, userId))
    .orderBy(desc(writingSubmissions.createdAt))
    .limit(limit);
}
