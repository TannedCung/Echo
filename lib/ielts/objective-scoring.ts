/**
 * Shared scoring engine for the two objective IELTS papers — Reading and
 * Listening. Both work the same way: a fixed set of questions with correct
 * answers, marked one point each, then the raw score is converted to a band via
 * an official raw→band table. This module is pure and UI-free so the routes, the
 * report UI, and tests share one source of truth (mirrors band-descriptors.ts
 * for Speaking).
 *
 * @see https://www.ielts.org/for-test-takers/how-ielts-is-scored
 */

/**
 * The objective question types Echo supports. `true-false-notgiven` and
 * `yes-no-notgiven` render fixed option sets; `multiple-choice` uses the
 * question's own options; `short-answer` is a typed gap-fill graded against a
 * small set of accepted spellings.
 */
export const OBJECTIVE_QUESTION_TYPES = [
  "multiple-choice",
  "true-false-notgiven",
  "yes-no-notgiven",
  "short-answer",
] as const;

export type ObjectiveQuestionType = (typeof OBJECTIVE_QUESTION_TYPES)[number];

export interface ObjectiveQuestion {
  id: string;
  type: ObjectiveQuestionType;
  /** The question text shown to the candidate. */
  prompt: string;
  /** Options for `multiple-choice` (ignored for the fixed-option types). */
  options?: string[];
  /**
   * Accepted correct answers. The first is treated as the canonical answer for
   * the report; any of them counts as correct (case/space/punctuation-insensitive).
   */
  answers: string[];
  /** Optional guidance for short-answer, e.g. "No more than two words". */
  wordLimit?: string;
}

/**
 * A question with its correct answers stripped, safe to send to the browser. The
 * candidate must never receive the answer key, so surfaces render this shape and
 * grading happens on the server against the full `ObjectiveQuestion`.
 */
export type PublicQuestion = Omit<ObjectiveQuestion, "answers">;

/** Project a question to its client-safe form (drops the answer key). */
export function toPublicQuestion(question: ObjectiveQuestion): PublicQuestion {
  const { answers: _answers, ...rest } = question;
  void _answers;
  return rest;
}

/** Fixed option sets for the two verdict question types. */
export const TRUE_FALSE_NOTGIVEN = ["True", "False", "Not Given"] as const;
export const YES_NO_NOTGIVEN = ["Yes", "No", "Not Given"] as const;

/** The options a question presents, deriving fixed sets from the question type. */
export function optionsFor(
  question: Pick<ObjectiveQuestion, "type" | "options">,
): readonly string[] {
  switch (question.type) {
    case "true-false-notgiven":
      return TRUE_FALSE_NOTGIVEN;
    case "yes-no-notgiven":
      return YES_NO_NOTGIVEN;
    default:
      return question.options ?? [];
  }
}

/** Normalise a free-text answer so trivial differences don't cost a mark. */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^(a|an|the)\s+/i, "")
    .replace(/[.,!?;:"']+$/g, "");
}

/** True when a candidate's response matches any accepted answer. */
export function isCorrect(
  question: ObjectiveQuestion,
  response: string | undefined | null,
): boolean {
  if (response == null || response.trim() === "") return false;
  const given = normalize(response);
  return question.answers.some((answer) => normalize(answer) === given);
}

export interface GradedQuestion {
  id: string;
  prompt: string;
  /** What the candidate answered (empty string if skipped). */
  response: string;
  /** The canonical correct answer, for review. */
  correctAnswer: string;
  correct: boolean;
}

export interface GradedResult {
  perQuestion: GradedQuestion[];
  raw: number;
  total: number;
}

/** Mark a set of responses against the questions, one point per correct answer. */
export function gradeAnswers(
  questions: ObjectiveQuestion[],
  responses: Record<string, string>,
): GradedResult {
  const perQuestion = questions.map((question) => {
    const response = responses[question.id] ?? "";
    return {
      id: question.id,
      prompt: question.prompt,
      response,
      correctAnswer: question.answers[0] ?? "",
      correct: isCorrect(question, response),
    };
  });
  return {
    perQuestion,
    raw: perQuestion.filter((q) => q.correct).length,
    total: questions.length,
  };
}

/**
 * A raw→band conversion table entry: any raw score (out of 40) at or above
 * `minRaw` earns `band`. Tables are ordered from highest band to lowest.
 */
export type BandTable = readonly (readonly [minRaw: number, band: number])[];

/**
 * Convert a raw score to an IELTS band using an official 40-question table.
 * Echo's practice papers are shorter than a full 40-question paper, so the raw
 * score is first scaled proportionally to a /40 basis before lookup — an
 * intentional approximation that keeps short practice sets on the official band
 * scale. A perfect score always maps to the top band.
 */
export function rawToBand(raw: number, total: number, table: BandTable): number {
  if (total <= 0) return 0;
  const scaled = Math.round((raw / total) * 40);
  for (const [minRaw, band] of table) {
    if (scaled >= minRaw) return band;
  }
  return 0;
}
