import { and, asc, desc, eq } from "drizzle-orm";

import type { ScoringResult } from "@/lib/ai/scoring-schema";
import { getDb } from "@/lib/db/client";
import {
  sessionScores,
  sessionTurns,
  speakingSessions,
  users,
  type SessionScore,
  type SessionTurn,
  type SpeakingSession,
} from "@/lib/db/schema";
import type { SpeakingMode } from "@/lib/ielts/examiner-flow";

/** One completed conversation turn, as captured client-side. */
export interface PersistTurn {
  role: "examiner" | "candidate";
  text: string;
  audioUrl?: string | null;
}

export interface PersistSessionInput {
  userId: string;
  name?: string | null;
  email?: string | null;
  isGuest?: boolean;
  mode: SpeakingMode;
  turns: PersistTurn[];
  scoring: ScoringResult;
}

/**
 * Persist a finished, scored speaking session in one transaction-like flow:
 * the session row, its ordered turns, and the band scores. Returns the new
 * session id so the caller can link to the report. The Neon HTTP driver does
 * not support interactive transactions, so writes are sequenced; a session is
 * only created once scoring has succeeded, keeping orphan rows unlikely.
 */
export async function persistScoredSession(input: PersistSessionInput): Promise<string> {
  const db = getDb();
  const { scoring } = input;

  // Guests (and signed-in users who skipped onboarding) may not have a row yet;
  // the session FK requires one. Create a minimal profile if it's missing.
  await db
    .insert(users)
    .values({
      id: input.userId,
      name: input.name ?? null,
      email: input.email ?? null,
      isGuest: input.isGuest ? 1 : 0,
    })
    .onConflictDoNothing({ target: users.id });

  const [session] = await db
    .insert(speakingSessions)
    .values({
      userId: input.userId,
      mode: input.mode,
      status: "completed",
      overallBand: scoring.overall,
      endedAt: new Date(),
    })
    .returning({ id: speakingSessions.id });

  const sessionId = session.id;

  if (input.turns.length > 0) {
    await db.insert(sessionTurns).values(
      input.turns.map((turn, index) => ({
        sessionId,
        role: turn.role,
        text: turn.text,
        audioUrl: turn.audioUrl ?? null,
        order: index,
      })),
    );
  }

  await db.insert(sessionScores).values({
    sessionId,
    fluencyCoherence: scoring.fluencyCoherence.band,
    lexicalResource: scoring.lexicalResource.band,
    grammaticalRange: scoring.grammaticalRange.band,
    pronunciation: scoring.pronunciation.band,
    overall: scoring.overall,
    feedback: scoring,
  });

  return sessionId;
}

export interface SpeakingReport {
  session: SpeakingSession;
  score: (Omit<SessionScore, "feedback"> & { feedback: ScoringResult }) | null;
  turns: SessionTurn[];
}

/**
 * Load a full session report for its owner. Scoped to `userId` so one learner
 * can never read another's session. Returns null when the session is missing
 * or not owned by the requester.
 */
export async function getSpeakingReport(
  sessionId: string,
  userId: string,
): Promise<SpeakingReport | null> {
  const db = getDb();

  const [session] = await db
    .select()
    .from(speakingSessions)
    .where(and(eq(speakingSessions.id, sessionId), eq(speakingSessions.userId, userId)))
    .limit(1);

  if (!session) return null;

  const [turns, [score]] = await Promise.all([
    db
      .select()
      .from(sessionTurns)
      .where(eq(sessionTurns.sessionId, sessionId))
      .orderBy(asc(sessionTurns.order)),
    db.select().from(sessionScores).where(eq(sessionScores.sessionId, sessionId)).limit(1),
  ]);

  return {
    session,
    score: score ? { ...score, feedback: score.feedback as ScoringResult } : null,
    turns,
  };
}

/** Recent completed sessions for a user, newest first (dashboard/history). */
export async function getRecentSessions(userId: string, limit = 5): Promise<SpeakingSession[]> {
  const db = getDb();
  return db
    .select()
    .from(speakingSessions)
    .where(eq(speakingSessions.userId, userId))
    .orderBy(desc(speakingSessions.startedAt))
    .limit(limit);
}
