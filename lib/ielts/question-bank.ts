/**
 * The seedable question bank — now a flat view over the {@link EXAM_LIBRARY}.
 * The library (lib/ielts/exam-library.ts) is the source of truth; this module
 * flattens it into `QUESTION_BANK` rows for the `question_bank` table (see
 * lib/db/schema.ts) and re-exports the shared types + per-part/per-mode helpers
 * so existing import sites keep working unchanged.
 */

import { allQuestions } from "./exam-library";

export type { QuestionItem, QuestionPart } from "./exam-library";
export { questionsForPart, questionsForMode } from "./exam-library";

/** Every question across the library, flattened (Part 1 topics, then 2, then 3). */
export const QUESTION_BANK = allQuestions();
