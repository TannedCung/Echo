import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { users, type User } from "@/lib/db/schema";

/** Fetch a user's app profile by auth subject id, or null if not yet stored. */
export async function getUserById(id: string): Promise<User | null> {
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export interface SaveOnboardingInput {
  id: string;
  name?: string | null;
  email?: string | null;
  isGuest?: boolean;
  goalBand: number;
  testDate: Date | null;
}

/**
 * Upsert the user's profile with their onboarding choices. `users.id` is the
 * auth subject (Google sub or guest id), so the same call works whether or not
 * a row already exists.
 */
export async function saveOnboarding(input: SaveOnboardingInput): Promise<void> {
  const db = getDb();
  await db
    .insert(users)
    .values({
      id: input.id,
      name: input.name ?? null,
      email: input.email ?? null,
      isGuest: input.isGuest ? 1 : 0,
      goalBand: input.goalBand,
      testDate: input.testDate,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: { goalBand: input.goalBand, testDate: input.testDate },
    });
}
