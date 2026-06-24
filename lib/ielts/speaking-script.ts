import { PART2_PREP_SECONDS, PART2_TALK_SECONDS, type SpeakingMode } from "./examiner-flow";
import { questionsForPart, type QuestionItem, type QuestionPart } from "./question-bank";

/**
 * Turns the question bank into an ordered sequence of examiner "moves" for a
 * mode, and answers "what should the examiner do on turn N?". Pure and UI-free
 * so both the turn route and tests share one flow definition.
 *
 * Each move corresponds to one examiner utterance followed (except the closing)
 * by one candidate answer — so the candidate's `turnIndex` indexes the script.
 * A Part 2 cue card is a single move: one long turn (1-min prep + ~2-min talk).
 */

export interface CueCard {
  topic: string;
  prompt: string;
  bullets: string[];
  prepSeconds: number;
  talkSeconds: number;
}

export type ExaminerMove =
  | { kind: "question"; part: QuestionPart; topic: string; text: string }
  | ({ kind: "cue_card"; part: "part2" } & CueCard)
  | { kind: "closing" };

/** Human label for a part, e.g. "Part 1". */
export function partLabel(part: QuestionPart): string {
  return part.replace("part", "Part ");
}

/** How many Part 1 / Part 3 topics each mode draws from the bank. */
const TOPIC_BUDGET = {
  part1: 2,
  part3: 1,
  fullMockPart1: 2,
  fullMockPart3: 1,
} as const;

function questionMoves(items: QuestionItem[]): ExaminerMove[] {
  return items.flatMap((item): ExaminerMove[] => [
    { kind: "question", part: item.part, topic: item.topic, text: item.prompt },
    ...item.followUps.map(
      (text): ExaminerMove => ({ kind: "question", part: item.part, topic: item.topic, text }),
    ),
  ]);
}

function cueCardMove(item: QuestionItem): ExaminerMove {
  return {
    kind: "cue_card",
    part: "part2",
    topic: item.topic,
    prompt: item.prompt,
    bullets: item.followUps,
    prepSeconds: PART2_PREP_SECONDS,
    talkSeconds: PART2_TALK_SECONDS,
  };
}

/** The full ordered list of examiner moves for a mode (excludes the closing). */
export function speakingScript(mode: SpeakingMode): ExaminerMove[] {
  switch (mode) {
    case "part1":
      return questionMoves(questionsForPart("part1").slice(0, TOPIC_BUDGET.part1));
    case "part2":
      return [cueCardMove(questionsForPart("part2")[0])];
    case "part3":
      return questionMoves(questionsForPart("part3").slice(0, TOPIC_BUDGET.part3));
    case "full_mock":
      return [
        ...questionMoves(questionsForPart("part1").slice(0, TOPIC_BUDGET.fullMockPart1)),
        cueCardMove(questionsForPart("part2")[0]),
        ...questionMoves(questionsForPart("part3").slice(0, TOPIC_BUDGET.fullMockPart3)),
      ];
  }
}

export interface PlannedTurn {
  move: ExaminerMove;
  /** True once the script is exhausted — the examiner should close out. */
  complete: boolean;
  /** First move of the whole session (greet the candidate). */
  isFirst: boolean;
  /** First move of a new part (announce the transition). */
  partChanged: boolean;
}

/** The current part of a move, or null for the closing. */
function movePart(move: ExaminerMove): QuestionPart | null {
  return move.kind === "closing" ? null : move.part;
}

/**
 * What the examiner should do for a given candidate `turnIndex` (0 = opening).
 * Once the index runs past the script, returns the closing move with
 * `complete: true` so the caller knows the part/mock is over.
 */
export function planTurn(mode: SpeakingMode, turnIndex: number): PlannedTurn {
  const script = speakingScript(mode);

  if (turnIndex >= script.length) {
    return { move: { kind: "closing" }, complete: true, isFirst: false, partChanged: false };
  }

  const move = script[turnIndex];
  const prev = turnIndex > 0 ? script[turnIndex - 1] : null;
  return {
    move,
    complete: false,
    isFirst: turnIndex === 0,
    partChanged: movePart(move) !== (prev ? movePart(prev) : null),
  };
}
