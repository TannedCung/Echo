"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import type { MascotState } from "@/components/mascot/echo-mascot";
import type { ScoringResult } from "@/lib/ai/scoring-schema";
import { useRecorder } from "@/hooks/use-recorder";
import type { ConversationTurn } from "@/lib/conversation/types";
import type { SpeakingMode } from "@/lib/ielts/examiner-flow";
import type { QuestionPart } from "@/lib/ielts/question-bank";
import type { CueCard } from "@/lib/ielts/speaking-script";

export type SessionPhase =
  | "idle" // not started
  | "examiner" // examiner is speaking (TTS)
  | "thinking" // streaming the examiner reply / transcribing
  | "ready" // candidate's turn — tap to answer
  | "prep" // Part 2 — preparing for the long turn
  | "recording" // capturing the candidate
  | "scoring" // part finished, awaiting the band report
  | "complete" // part finished and scored (inline report)
  | "error";

type MoveKind = "question" | "cue_card" | "closing";

interface HistoryEntry {
  role: "examiner" | "candidate";
  text: string;
  audioUrl?: string | null;
}

/** Stores the answer clip in Blob (best-effort), returning its URL or null. */
async function uploadAnswerAudio(blob: Blob): Promise<string | null> {
  try {
    const res = await fetch("/api/speaking/audio", {
      method: "POST",
      headers: { "Content-Type": blob.type || "audio/webm" },
      body: blob,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string | null };
    return data.url ?? null;
  } catch {
    return null;
  }
}

const MASCOT_BY_PHASE: Record<SessionPhase, MascotState> = {
  idle: "idle",
  examiner: "speaking",
  thinking: "thinking",
  ready: "idle",
  prep: "idle",
  recording: "listening",
  scoring: "thinking",
  complete: "idle",
  error: "idle",
};

/**
 * Orchestrates one chained (Mode A) speaking session across Parts 1–3:
 *   examiner turn (LLM → TTS) → candidate records → STT → repeat.
 * The flow (which question, the Part 2 cue card, part transitions) is decided
 * server-side in /api/speaking/turn; the first SSE frame's `meta` tells this
 * hook how to behave (cue card + prep/talk timers vs. a normal question).
 */
export function useSpeakingSession(mode: SpeakingMode = "part1") {
  const router = useRouter();
  const recorder = useRecorder();
  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [part, setPart] = useState<QuestionPart | null>(null);
  const [cueCard, setCueCard] = useState<CueCard | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const turnIndexRef = useRef(0); // candidate answers given so far
  const examSeedRef = useRef(""); // pins one exam form from the library per session
  const historyRef = useRef<HistoryEntry[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cueCardRef = useRef<CueCard | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const busyRef = useRef(false);
  // Indirection so the countdown closures never go stale or create deps cycles.
  const beginTalkRef = useRef<() => void>(() => {});
  const submitAnswerRef = useRef<() => void>(() => {});

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSecondsLeft(null);
  }, []);

  /** Counts `seconds` down, calling `onDone` at zero (also exposes secondsLeft). */
  const startCountdown = useCallback(
    (seconds: number, onDone: () => void) => {
      clearTimer();
      setSecondsLeft(seconds);
      let remaining = seconds;
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          clearTimer();
          onDone();
        }
      }, 1000);
    },
    [clearTimer],
  );

  const speak = useCallback(async (text: string) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return; // keep the transcript even if audio fails
      const url = URL.createObjectURL(await res.blob());
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      audio.src = url;
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    } catch {
      // ignore audio errors — the conversation continues in text
    }
  }, []);

  /** Streams one examiner utterance into the transcript, then speaks it. */
  const runExaminerTurn = useCallback(async (): Promise<{ complete: boolean; kind: MoveKind }> => {
    setPhase("thinking");
    setTurns((prev) => [...prev, { role: "examiner", text: "", partial: true }]);

    let accumulated = "";
    let complete = false;
    let kind: MoveKind = "question";

    const res = await fetch("/api/speaking/turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        turnIndex: turnIndexRef.current,
        examSeed: examSeedRef.current,
        history: historyRef.current,
      }),
    });
    if (!res.ok || !res.body) {
      throw new Error("The examiner is unavailable right now.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";
      for (const frame of frames) {
        const line = frame.trim();
        if (!line.startsWith("data:")) continue;
        const payload = JSON.parse(line.slice(5).trim()) as {
          meta?: { kind: MoveKind; part?: QuestionPart; cueCard?: CueCard };
          delta?: string;
          done?: boolean;
          complete?: boolean;
          error?: string;
        };
        if (payload.error) throw new Error(payload.error);
        if (payload.meta) {
          kind = payload.meta.kind;
          setPart(payload.meta.part ?? null);
          if (payload.meta.kind === "cue_card" && payload.meta.cueCard) {
            cueCardRef.current = payload.meta.cueCard;
            setCueCard(payload.meta.cueCard);
          }
        }
        if (payload.delta) {
          accumulated += payload.delta;
          setTurns((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "examiner", text: accumulated, partial: true };
            return next;
          });
        }
        if (payload.done) complete = Boolean(payload.complete);
      }
    }

    setTurns((prev) => {
      const next = [...prev];
      next[next.length - 1] = { role: "examiner", text: accumulated, partial: false };
      return next;
    });
    historyRef.current = [...historyRef.current, { role: "examiner", text: accumulated }];

    setPhase("examiner");
    await speak(accumulated);
    return { complete, kind };
  }, [mode, speak]);

  /**
   * The session is over: score the transcript. When a report is persisted we
   * hand off to its page; otherwise (no DB) we keep the band report inline.
   */
  const finishAndScore = useCallback(async () => {
    clearTimer();
    setPhase("scoring");
    try {
      const res = await fetch("/api/speaking/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, turns: historyRef.current }),
      });
      if (!res.ok) throw new Error("We couldn't score that session — give it another go.");
      const data = (await res.json()) as { sessionId: string | null; scoring: ScoringResult };
      if (data.sessionId) {
        router.push(`/reports/${data.sessionId}`);
        return; // stay on "scoring" while the report page loads
      }
      setScoring(data.scoring);
      setPhase("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while scoring.");
      setPhase("error");
    }
  }, [mode, router, clearTimer]);

  /** Routes to the next UI state once an examiner turn has finished speaking. */
  const advanceAfter = useCallback(
    (result: { complete: boolean; kind: MoveKind }) => {
      if (result.complete) {
        void finishAndScore();
      } else if (result.kind === "cue_card") {
        setPhase("prep");
        startCountdown(cueCardRef.current?.prepSeconds ?? 60, () => beginTalkRef.current());
      } else {
        setPhase("ready");
      }
    },
    [finishAndScore, startCountdown],
  );

  const submitAnswer = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    clearTimer();
    setPhase("thinking");
    const blob = await recorder.stop();
    if (!blob) {
      busyRef.current = false;
      setPhase("ready");
      return;
    }
    try {
      // Transcribe and archive the clip in parallel — neither blocks the other.
      const [res, audioUrl] = await Promise.all([
        fetch("/api/stt/transcribe", {
          method: "POST",
          headers: { "Content-Type": blob.type },
          body: blob,
        }),
        uploadAnswerAudio(blob),
      ]);
      if (!res.ok) throw new Error("Couldn't transcribe your answer — give it another go.");
      const data = (await res.json()) as { text?: string };
      const text = data.text?.trim() || "(no speech detected)";

      setTurns((prev) => [...prev, { role: "candidate", text, audioUrl: audioUrl ?? undefined }]);
      historyRef.current = [...historyRef.current, { role: "candidate", text, audioUrl }];
      turnIndexRef.current += 1;
      setCueCard(null);
      cueCardRef.current = null;

      advanceAfter(await runExaminerTurn());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    } finally {
      busyRef.current = false;
    }
  }, [recorder, runExaminerTurn, advanceAfter, clearTimer]);
  submitAnswerRef.current = submitAnswer;

  /** Begin the candidate's recording (a normal answer, or the Part 2 long turn). */
  const beginAnswer = useCallback(async () => {
    setError(null);
    clearTimer();
    await recorder.start();
    setPhase("recording");
    const talkSeconds = cueCardRef.current?.talkSeconds;
    if (talkSeconds) {
      // Part 2 long turn — auto-submit when the 2-minute limit is reached.
      startCountdown(talkSeconds, () => submitAnswerRef.current());
    }
  }, [recorder, clearTimer, startCountdown]);
  beginTalkRef.current = beginAnswer;

  const start = useCallback(async () => {
    clearTimer();
    setError(null);
    setScoring(null);
    setCueCard(null);
    cueCardRef.current = null;
    setPart(null);
    setTurns([]);
    historyRef.current = [];
    turnIndexRef.current = 0;
    examSeedRef.current = crypto.randomUUID();
    try {
      advanceAfter(await runExaminerTurn());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    }
  }, [runExaminerTurn, advanceAfter, clearTimer]);

  return {
    phase,
    turns,
    scoring,
    part,
    cueCard,
    secondsLeft,
    isFullMock: mode === "full_mock",
    error: error ?? recorder.error,
    mascotState: MASCOT_BY_PHASE[phase],
    level: recorder.level,
    start,
    beginAnswer,
    submitAnswer,
  };
}
