/**
 * Official IELTS Writing assessment criteria, encoded as data so the scorer
 * agent, the UI, and tests share one source of truth (mirrors the Speaking
 * band-descriptors.ts). Writing is marked on four equally weighted criteria;
 * the first is named "Task Achievement" for Task 1 and "Task Response" for
 * Task 2, so we carry a per-task label.
 *
 * @see https://www.ielts.org/for-test-takers/how-ielts-is-scored
 */

export const WRITING_CRITERIA = [
  "taskResponse",
  "coherenceCohesion",
  "lexicalResource",
  "grammaticalRange",
] as const;

export type WritingCriterion = (typeof WRITING_CRITERIA)[number];

export type WritingTaskType = "task1" | "task2";

export interface WritingCriterionInfo {
  key: WritingCriterion;
  /** Label for Task 2 (essay) — the default presentation. */
  label: string;
  /** Label override for Task 1 (report/letter), where it differs. */
  task1Label?: string;
  short: string;
  description: string;
}

export const WRITING_CRITERIA_INFO: Record<WritingCriterion, WritingCriterionInfo> = {
  taskResponse: {
    key: "taskResponse",
    label: "Task Response",
    task1Label: "Task Achievement",
    short: "Task",
    description:
      "How fully the response addresses all parts of the task, develops a clear position or overview, and supports ideas with relevant detail.",
  },
  coherenceCohesion: {
    key: "coherenceCohesion",
    label: "Coherence & Cohesion",
    short: "Coherence",
    description:
      "Logical organisation of information and ideas, clear progression, effective paragraphing, and accurate use of cohesive devices.",
  },
  lexicalResource: {
    key: "lexicalResource",
    label: "Lexical Resource",
    short: "Vocabulary",
    description:
      "Range and precision of vocabulary, including less common items, collocation, and control of spelling and word formation.",
  },
  grammaticalRange: {
    key: "grammaticalRange",
    label: "Grammatical Range & Accuracy",
    short: "Grammar",
    description:
      "Range of sentence structures and the accuracy and appropriacy with which they are used, including punctuation.",
  },
};

/** The label for a criterion given the task type (Task 1 vs Task 2 wording). */
export function criterionLabel(key: WritingCriterion, task: WritingTaskType): string {
  const info = WRITING_CRITERIA_INFO[key];
  return task === "task1" && info.task1Label ? info.task1Label : info.label;
}

/** Minimum expected word counts per task, used for a gentle nudge (not a penalty gate). */
export const WRITING_MIN_WORDS: Record<WritingTaskType, number> = {
  task1: 150,
  task2: 250,
};

/** IELTS bands are reported in half-band steps from 0 to 9. */
export function roundToBand(value: number): number {
  return Math.round(value * 2) / 2;
}

/** Overall Writing band = average of the four criteria, rounded to the nearest half. */
export function overallWritingBand(scores: Record<WritingCriterion, number>): number {
  const sum = WRITING_CRITERIA.reduce((acc, key) => acc + scores[key], 0);
  return roundToBand(sum / WRITING_CRITERIA.length);
}

/** Count words in a free-text response the way a rater would (whitespace-split). */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
