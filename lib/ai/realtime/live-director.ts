import type { LiveExaminerPhase } from "@/lib/conversation/types";
import {
  ANSWER_SOFT_LIMIT_SECONDS,
  PART1_BUDGET_SECONDS,
  PART2_PREP_SECONDS,
  PART2_TALK_SECONDS,
  PART3_BUDGET_SECONDS,
  type SpeakingMode,
} from "@/lib/ielts/examiner-flow";

/**
 * The proactive "director" behind the live (Mode B) examiner — the agentic
 * layer that makes a self-driving voice model behave like a real, time-boxed
 * IELTS examiner. The Live model signals its phase transitions by calling tools
 * (begin_part / start_long_turn_preparation); this director owns the clocks and
 * pushes private stage directions back when a deadline lands:
 *
 *   • candidate answering too long       → interrupt and move on
 *   • Part 2 one-minute prep elapses      → tell them to start speaking
 *   • Part 2 two-minute long turn elapses → stop them, continue
 *   • a part runs over its budget          → wrap the part up
 *
 * It also reports the current timed phase (+ countdown) for the UI. Pure and
 * SDK-free so it runs in the browser and is unit-testable with fake timers.
 */

export interface DirectorActions {
  /** Deliver a private stage direction to the examiner (it must not read aloud). */
  instruct(directive: string): void;
  /** Surface the current timed phase to the UI, or null to clear it. */
  onPhase?(phase: LiveExaminerPhase | null): void;
}

type Timer = ReturnType<typeof setTimeout>;

const TAG = "[Director]";
const SILENT = "Do not read this message aloud.";

export class LiveDirector {
  private readonly mode: SpeakingMode;
  private readonly actions: DirectorActions;

  private part: 1 | 2 | 3 | null = null;
  private inLongTurn = false;
  private candidateAnswering = false;
  private interruptedThisTurn = false;

  private budgetTimer: Timer | null = null;
  private answerTimer: Timer | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  constructor(mode: SpeakingMode, actions: DirectorActions) {
    this.mode = mode;
    this.actions = actions;
  }

  /** Tool: the examiner has entered Part `part`. Start its budget + UI phase. */
  beginPart(part: number): void {
    if (part !== 1 && part !== 2 && part !== 3) return;
    this.part = part;
    this.clearBudget();
    this.resetAnswerTracking();

    if (part === 1) {
      this.actions.onPhase?.({ part: 1, stage: "interview", label: "Part 1 · Interview" });
      this.budgetTimer = setTimeout(() => {
        this.actions.instruct(
          `${TAG} You've spent enough time on Part 1. Ask at most one more short question, then ${this.afterPart(1)}. ${SILENT}`,
        );
      }, PART1_BUDGET_SECONDS * 1000);
    } else if (part === 2) {
      this.actions.onPhase?.({ part: 2, stage: "long_turn", label: "Part 2 · Long turn" });
    } else {
      this.actions.onPhase?.({ part: 3, stage: "discussion", label: "Part 3 · Discussion" });
      this.budgetTimer = setTimeout(() => {
        this.actions.instruct(
          `${TAG} You've spent enough time on Part 3. Ask at most one more question, then ${this.afterPart(3)}. ${SILENT}`,
        );
      }, PART3_BUDGET_SECONDS * 1000);
    }
  }

  /**
   * Tool: the examiner has just finished reading the Part 2 cue card. Run the
   * one-minute prep countdown (the candidate prepares in silence), then prompt
   * them to start, then cap the long turn at two minutes.
   */
  startLongTurnPreparation(): void {
    this.part = 2;
    this.inLongTurn = false;
    this.resetAnswerTracking();
    this.clearBudget();

    this.countdown(
      PART2_PREP_SECONDS,
      { part: 2, stage: "prep", label: "Part 2 · Preparing" },
      () => {
        this.actions.instruct(
          `${TAG} The candidate's one-minute preparation is over. Warmly invite them to begin their long-turn answer now, and let them speak for up to two minutes without interrupting.`,
        );
        this.beginLongTurn();
      },
    );
  }

  /** The candidate is producing speech (input transcription arriving). */
  noteCandidateActivity(): void {
    if (this.inLongTurn || this.interruptedThisTurn) return;
    if (this.candidateAnswering) return;
    this.candidateAnswering = true;
    this.answerTimer = setTimeout(() => {
      this.actions.instruct(
        `${TAG} The candidate has been answering for a while. Politely interrupt now: briefly acknowledge what they said, then ask your next question or move on. ${SILENT}`,
      );
      this.interruptedThisTurn = true;
      this.candidateAnswering = false;
    }, ANSWER_SOFT_LIMIT_SECONDS * 1000);
  }

  /** The examiner is speaking — the candidate's answer window has closed. */
  noteExaminerActivity(): void {
    this.resetAnswerTracking();
  }

  /** The examiner's turn finished; the candidate's answer window opens fresh. */
  noteTurnComplete(): void {
    this.resetAnswerTracking();
  }

  /** Tear down every timer and clear the UI phase. */
  stop(): void {
    this.clearBudget();
    this.clearAnswerTimer();
    this.clearCountdown();
    this.candidateAnswering = false;
    this.interruptedThisTurn = false;
    this.actions.onPhase?.(null);
  }

  private beginLongTurn(): void {
    this.inLongTurn = true;
    this.countdown(
      PART2_TALK_SECONDS,
      { part: 2, stage: "long_turn", label: "Part 2 · Speaking" },
      () => {
        this.actions.instruct(
          `${TAG} The candidate has now spoken for about two minutes. Gently stop them, thank them, and ${this.afterPart(2)}. ${SILENT}`,
        );
        this.inLongTurn = false;
      },
    );
  }

  /** What to do once a part's time is up, given what (if anything) comes next. */
  private afterPart(part: 1 | 2 | 3): string {
    if (this.mode === "full_mock") {
      if (part === 1) return "move on to the Part 2 long turn";
      if (part === 2) return "move on to Part 3";
    }
    return "begin to bring the test to a close";
  }

  /** Runs a per-second countdown, emitting phase updates, then calls `onDone`. */
  private countdown(
    seconds: number,
    phase: Omit<LiveExaminerPhase, "countdown">,
    onDone: () => void,
  ): void {
    this.clearCountdown();
    let remaining = seconds;
    this.actions.onPhase?.({ ...phase, countdown: remaining });
    this.countdownTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        this.clearCountdown();
        this.actions.onPhase?.({ ...phase, countdown: 0 });
        onDone();
        return;
      }
      this.actions.onPhase?.({ ...phase, countdown: remaining });
    }, 1000);
  }

  private resetAnswerTracking(): void {
    this.clearAnswerTimer();
    this.candidateAnswering = false;
    this.interruptedThisTurn = false;
  }

  private clearBudget(): void {
    if (this.budgetTimer) clearTimeout(this.budgetTimer);
    this.budgetTimer = null;
  }

  private clearAnswerTimer(): void {
    if (this.answerTimer) clearTimeout(this.answerTimer);
    this.answerTimer = null;
  }

  private clearCountdown(): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = null;
  }
}
