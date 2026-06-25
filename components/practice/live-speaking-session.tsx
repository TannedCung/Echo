"use client";

import { Loader2, RotateCcw, Square } from "lucide-react";

import { EchoMascot } from "@/components/mascot/echo-mascot";
import { LiveTranscript } from "@/components/practice/live-transcript";
import { ScoreReport } from "@/components/reports/score-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLiveSession } from "@/hooks/use-live-session";

/**
 * Mode B (Gemini Live) speaking UI. A single bidirectional stream means there's
 * no per-turn "Answer / Done" — the candidate just talks naturally and Echo
 * replies in real time. The candidate ends the session, which scores the
 * captured transcript through the same report as Mode A.
 */
export function LiveSpeakingSession() {
  const session = useLiveSession("full_mock");

  if (session.phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <EchoMascot state="idle" size="lg" />
        <Badge tone="accent">Live mode · experimental</Badge>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Have a real conversation</h1>
          <p className="text-muted-foreground mx-auto max-w-md">
            Echo speaks and listens at the same time — just talk naturally, like a real exam. Tap
            end when you&apos;re done and we&apos;ll score the whole conversation.
          </p>
        </div>
        <Button size="lg" onClick={session.start}>
          Start live session
        </Button>
        <p className="text-muted-foreground max-w-md text-xs">
          You&apos;ll need to allow microphone access.
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

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <EchoMascot state={session.mascotState} size="lg" />
      <Badge tone="accent">Live mode</Badge>

      <p aria-live="polite" className="text-muted-foreground text-sm font-medium">
        {session.phase === "connecting" && "Connecting to Echo…"}
        {session.phase === "live" && "Listening — just talk naturally"}
        {session.phase === "scoring" && "Scoring your conversation against the band descriptors…"}
      </p>

      <LiveTranscript turns={session.turns} className="w-full" />

      {session.error && (
        <p className="text-destructive text-sm" role="alert">
          {session.error}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        {session.phase === "live" && (
          <Button size="lg" variant="accent" onClick={session.finish}>
            <Square className="size-4" aria-hidden /> End &amp; score
          </Button>
        )}
        {(session.phase === "connecting" || session.phase === "scoring") && (
          <Button size="lg" disabled>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Please wait
          </Button>
        )}
        {session.phase === "error" && (
          <Button size="lg" onClick={session.start}>
            <RotateCcw className="size-4" aria-hidden /> Try again
          </Button>
        )}
        {(session.phase === "live" || session.phase === "connecting") && (
          <Button variant="ghost" size="sm" onClick={session.cancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
