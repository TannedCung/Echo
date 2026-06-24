import { sql } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Echo data model (Neon Postgres via Drizzle). `users.id` is the auth subject
 * id (Google sub or guest id) — Auth.js uses JWT sessions, so this table only
 * stores app-specific profile data, not auth credentials.
 */

export const speakingModeEnum = pgEnum("speaking_mode", ["part1", "part2", "part3", "full_mock"]);

export const sessionStatusEnum = pgEnum("session_status", [
  "in_progress",
  "completed",
  "abandoned",
]);

export const turnRoleEnum = pgEnum("turn_role", ["examiner", "candidate"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  isGuest: integer("is_guest").default(0).notNull(),
  goalBand: doublePrecision("goal_band"),
  testDate: timestamp("test_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const speakingSessions = pgTable("speaking_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mode: speakingModeEnum("mode").notNull(),
  status: sessionStatusEnum("status").default("in_progress").notNull(),
  overallBand: doublePrecision("overall_band"),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

export const sessionTurns = pgTable("session_turns", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => speakingSessions.id, { onDelete: "cascade" }),
  role: turnRoleEnum("role").notNull(),
  text: text("text").notNull(),
  audioUrl: text("audio_url"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessionScores = pgTable("session_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => speakingSessions.id, { onDelete: "cascade" }),
  fluencyCoherence: doublePrecision("fluency_coherence").notNull(),
  lexicalResource: doublePrecision("lexical_resource").notNull(),
  grammaticalRange: doublePrecision("grammatical_range").notNull(),
  pronunciation: doublePrecision("pronunciation").notNull(),
  overall: doublePrecision("overall").notNull(),
  /** { evidence: {criterion: quotes[]}, upgrades: string[], summary: string } */
  feedback: jsonb("feedback").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const questionBank = pgTable("question_bank", {
  id: text("id").primaryKey(),
  part: text("part").notNull(),
  topic: text("topic").notNull(),
  prompt: text("prompt").notNull(),
  followUps: jsonb("follow_ups")
    .default(sql`'[]'::jsonb`)
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type SpeakingSession = typeof speakingSessions.$inferSelect;
export type SessionTurn = typeof sessionTurns.$inferSelect;
export type SessionScore = typeof sessionScores.$inferSelect;
