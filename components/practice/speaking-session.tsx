"use client";

import { Loader2, Mic, RotateCcw, Square } from "lucide-react";
import { useState } from "react";

import { EchoMascot } from "@/components/mascot/echo-mascot";
import { CueCard } from "@/components/practice/cue-card";
import { LiveTranscript } from "@/components/practice/live-transcript";
import { ScoreReport } from "@/components/reports/score-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpeakingSession, type SessionPhase } from "@/hooks/use-speaking-session";
import type { SpeakingMode } from "@/lib/ielts/examiner-flow";
import { partLabel } from "@/lib/ielts/speaking-script";

const STATUS: Partial<Record<SessionPhase, string>> = {
  examiner: "Echo is speaking…",
  thinking: "Echo is thinking…",
  ready: "Your turn — tap to answer",
  prep: "Prepare your answer — make a few notes",
  recording: "Listening… speak now, then tap done",
  scoring: "Scoring your answers against the band descriptors…",
};

const MODES: { value: SpeakingMode; label: string; blurb: string }[] = [
  {
    value: "part1",
    label: "Part 1 warm-up",
    blurb: "A few familiar questions to get you talking. ~5 minutes.",
  },
  {
    value: "full_mock",
    label: "Full mock test",
    blurb: "All three parts — interview, cue card long turn, and discussion.",
  },
];

export function SpeakingSession() {
  const [mode, setMode] = useState<SpeakingMode>("part1");
  const session = useSpeakingSession(mode);

  if (session.phase === "idle") {
    const active = MODES.find((m) => m.value === mode)!;
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <EchoMascot state="idle" size="lg" />
        <Badge tone="primary">IELTS Speaking</Badge>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Ready when you are</h1>
          <p className="text-muted-foreground mx-auto max-w-md">{active.blurb}</p>
        </div>

        <div
          role="radiogroup"
          aria-label="Choose a session type"
          className="flex flex-col gap-2 sm:flex-row"
        >
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={mode === m.value}
              onClick={() => setMode(m.value)}
              className={
                "rounded-[var(--radius)] border px-4 py-2 text-sm font-semibold transition-colors " +
                (mode === m.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:text-foreground")
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        <Button size="lg" onClick={session.start}>
          Start session
        </Button>
        <p className="text-muted-foreground max-w-md text-xs">
          You&apos;ll need to allow microphone access. Answer out loud, then tap done.
        </p>
      </div>
    );
  }

  if (session.phase === "complete" && session.scoring) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <EchoMascot state="idle" size="md" label="Nice work — here's your report" />
        <Badge tone="success">Session complete</Badge>
        <ScoreReport scoring={session.scoring} transcript={session.turns} />
        <Button onClick={session.start} variant="outline">
          <RotateCcw className="size-4" aria-hidden /> Practice again
        </Button>
      </div>
    );
  }

  const showCueCard =
    session.cueCard && (session.phase === "prep" || session.phase === "recording");

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <EchoMascot state={session.mascotState} size="lg" />

      {session.part && (
        <Badge tone="primary">
          {session.isFullMock ? `Full mock · ${partLabel(session.part)}` : partLabel(session.part)}
        </Badge>
      )}

      {STATUS[session.phase] && (
        <p aria-live="polite" className="text-muted-foreground text-sm font-medium">
          {STATUS[session.phase]}
        </p>
      )}

      {showCueCard && (
        <CueCard
          cueCard={session.cueCard!}
          phase={session.phase === "prep" ? "prep" : "talk"}
          secondsLeft={session.secondsLeft}
        />
      )}

      {session.phase === "recording" && (
        <div
          className="bg-muted h-2 w-48 overflow-hidden rounded-full"
          role="meter"
          aria-label="Microphone input level"
          aria-valuenow={Math.round(session.level * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-75"
            style={{ width: `${Math.round(session.level * 100)}%` }}
          />
        </div>
      )}

      <LiveTranscript turns={session.turns} className="w-full" />

      {session.error && (
        <p className="text-destructive text-sm" role="alert">
          {session.error}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        {session.phase === "ready" && (
          <Button size="lg" onClick={session.beginAnswer}>
            <Mic className="size-4" aria-hidden /> Answer
          </Button>
        )}
        {session.phase === "prep" && (
          <Button size="lg" onClick={session.beginAnswer}>
            <Mic className="size-4" aria-hidden /> Start talking
          </Button>
        )}
        {session.phase === "recording" && (
          <Button size="lg" variant="accent" onClick={session.submitAnswer}>
            <Square className="size-4" aria-hidden /> Done answering
          </Button>
        )}
        {(session.phase === "examiner" ||
          session.phase === "thinking" ||
          session.phase === "scoring") && (
          <Button size="lg" disabled>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Please wait
          </Button>
        )}
        {session.phase === "error" && (
          <Button size="lg" onClick={session.start}>
            <RotateCcw className="size-4" aria-hidden /> Restart session
          </Button>
        )}
      </div>
    </div>
  );
}
