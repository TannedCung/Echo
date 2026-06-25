"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { MascotState } from "@/components/mascot/echo-mascot";
import type { ScoringResult } from "@/lib/ai/scoring-schema";
import { GeminiLiveEngine } from "@/lib/ai/realtime/gemini-live";
import type { ConversationTurn } from "@/lib/conversation/types";
import type { SpeakingMode } from "@/lib/ielts/examiner-flow";

export type LivePhase =
  | "idle" // not started
  | "connecting" // opening the live stream
  | "live" // bidirectional conversation in progress
  | "scoring" // session ended, awaiting the band report
  | "complete" // scored (inline report)
  | "error";

const MASCOT_BY_PHASE: Record<LivePhase, MascotState> = {
  idle: "idle",
  connecting: "thinking",
  live: "listening",
  scoring: "thinking",
  complete: "idle",
  error: "idle",
};

interface FinalTurn {
  role: "examiner" | "candidate";
  text: string;
}

/**
 * Orchestrates one live (Mode B) speaking session over a single Gemini Live
 * stream. The engine owns the audio; this hook tracks the running transcript
 * for the UI and, when the candidate ends the session, runs the SAME scorer as
 * Mode A on the captured transcript so band reports are identical across modes.
 */
export function useLiveSession(mode: SpeakingMode = "full_mock") {
  const router = useRouter();
  const [phase, setPhase] = useState<LivePhase>("idle");
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const engineRef = useRef<GeminiLiveEngine | null>(null);
  const historyRef = useRef<FinalTurn[]>([]);

  /** Upsert a streaming bubble: replace the trailing partial of this role, else append. */
  const upsertTurn = useCallback((turn: ConversationTurn) => {
    setTurns((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === turn.role && last.partial) {
        return [...prev.slice(0, -1), turn];
      }
      return [...prev, turn];
    });
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setScoring(null);
    setTurns([]);
    historyRef.current = [];
    setPhase("connecting");

    const engine = new GeminiLiveEngine();
    engineRef.current = engine;

    try {
      await engine.start(
        { sessionId: crypto.randomUUID(), speakingMode: mode },
        {
          onExaminerText: (turn) => {
            upsertTurn(turn);
            if (!turn.partial) historyRef.current.push({ role: "examiner", text: turn.text });
          },
          onCandidateText: (turn) => {
            upsertTurn(turn);
            if (!turn.partial) historyRef.current.push({ role: "candidate", text: turn.text });
          },
          onError: (err) => {
            setError(err.message);
            setPhase("error");
          },
        },
      );
      setPhase("live");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start the live session.");
      setPhase("error");
    }
  }, [mode, upsertTurn]);

  /** End the conversation and score the captured transcript (shared with Mode A). */
  const finish = useCallback(async () => {
    await engineRef.current?.stop().catch(() => {});
    engineRef.current = null;
    setPhase("scoring");

    const transcript = historyRef.current;
    if (transcript.length === 0) {
      setError("We didn't catch any of the conversation — give it another go.");
      setPhase("error");
      return;
    }

    try {
      const res = await fetch("/api/speaking/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, turns: transcript }),
      });
      if (!res.ok) throw new Error("We couldn't score that session — give it another go.");
      const data = (await res.json()) as { sessionId: string | null; scoring: ScoringResult };
      if (data.sessionId) {
        router.push(`/reports/${data.sessionId}`);
        return;
      }
      setScoring(data.scoring);
      setPhase("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while scoring.");
      setPhase("error");
    }
  }, [mode, router]);

  const cancel = useCallback(async () => {
    await engineRef.current?.stop().catch(() => {});
    engineRef.current = null;
    setPhase("idle");
    setTurns([]);
    historyRef.current = [];
  }, []);

  return {
    phase,
    turns,
    scoring,
    error,
    mascotState: MASCOT_BY_PHASE[phase],
    start,
    finish,
    cancel,
  };
}
