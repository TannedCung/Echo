import type { ExaminerState, SpeakingMode } from "@/lib/ielts/examiner-flow";

/**
 * The mode-agnostic seam between the speaking UI and the conversation engine.
 *
 * Mode A (chained): STT → examiner agent → TTS, implemented in Milestone 4.
 * Mode B (live):    Gemini Live S2S single stream, implemented in Milestone 7.
 *
 * Both engines implement `ConversationEngine`, so the recorder, mascot, and
 * transcript UI never need to know which mode is active.
 */

export type ConversationMode = "chained" | "live";

export interface ConversationTurn {
  role: "examiner" | "candidate";
  text: string;
  /** True while still being streamed/transcribed (interim result). */
  partial?: boolean;
  audioUrl?: string;
}

export interface ConversationSessionConfig {
  sessionId: string;
  speakingMode: SpeakingMode;
}

export interface ConversationCallbacks {
  onStateChange?(state: ExaminerState): void;
  onExaminerText?(turn: ConversationTurn): void;
  onCandidateText?(turn: ConversationTurn): void;
  /** Fires when the examiner starts (true) or stops (false) speaking aloud. */
  onSpeakingChange?(speaking: boolean): void;
  onError?(error: Error): void;
}

export interface ConversationEngine {
  readonly mode: ConversationMode;
  /** Begin the session; the engine drives examiner turns and listens. */
  start(config: ConversationSessionConfig, callbacks: ConversationCallbacks): Promise<void>;
  /** Signal that the candidate has finished their current turn (push-to-talk). */
  endTurn(): void;
  /** End the whole session and release resources. */
  stop(): Promise<void>;
}
