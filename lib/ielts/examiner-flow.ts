/**
 * The IELTS Speaking test structure as a small, pure state machine. The
 * examiner agent and the conversation UI both drive transitions through this,
 * keeping timing and ordering logic testable and UI-free.
 *
 * Real test shape:
 *   Part 1 — intro & interview (4–5 min, familiar topics)
 *   Part 2 — cue card / long turn (1 min prep + up to 2 min talk)
 *   Part 3 — two-way discussion (4–5 min, abstract questions)
 */

export const EXAMINER_STATES = [
  "intro",
  "part1",
  "part2_prep",
  "part2_talk",
  "part3",
  "scoring",
  "done",
] as const;

export type ExaminerState = (typeof EXAMINER_STATES)[number];

export type SpeakingMode = "part1" | "part2" | "part3" | "full_mock";

export interface FlowContext {
  mode: SpeakingMode;
  state: ExaminerState;
}

/** Seconds allotted to timed Part 2 phases. */
export const PART2_PREP_SECONDS = 60;
export const PART2_TALK_SECONDS = 120;

/**
 * Soft time budgets the live director (Mode B) enforces so a session feels like
 * a real, time-boxed exam. Part 1/3 are capped; a single non-long-turn answer
 * gets a gentle interrupt once it runs past the answer limit.
 */
export const PART1_BUDGET_SECONDS = 270; // ~4.5 min
export const PART3_BUDGET_SECONDS = 270; // ~4.5 min
export const ANSWER_SOFT_LIMIT_SECONDS = 55;
/** Silence after a question past which the examiner gently nudges the candidate. */
export const SILENCE_REMINDER_SECONDS = 12;

const FULL_MOCK_ORDER: ExaminerState[] = [
  "intro",
  "part1",
  "part2_prep",
  "part2_talk",
  "part3",
  "scoring",
  "done",
];

const SINGLE_PART_ORDER: Record<Exclude<SpeakingMode, "full_mock">, ExaminerState[]> = {
  part1: ["intro", "part1", "scoring", "done"],
  part2: ["intro", "part2_prep", "part2_talk", "scoring", "done"],
  part3: ["intro", "part3", "scoring", "done"],
};

export function flowOrder(mode: SpeakingMode): ExaminerState[] {
  return mode === "full_mock" ? FULL_MOCK_ORDER : SINGLE_PART_ORDER[mode];
}

export function initialState(mode: SpeakingMode): ExaminerState {
  return flowOrder(mode)[0];
}

/** Returns the next state for a mode, or the same state if already at the end. */
export function nextState(ctx: FlowContext): ExaminerState {
  const order = flowOrder(ctx.mode);
  const idx = order.indexOf(ctx.state);
  if (idx === -1 || idx === order.length - 1) return ctx.state;
  return order[idx + 1];
}

export function isTerminal(state: ExaminerState): boolean {
  return state === "done";
}

/** States during which the candidate is expected to be speaking. */
export function isCandidateTurn(state: ExaminerState): boolean {
  return state === "part1" || state === "part2_talk" || state === "part3";
}
