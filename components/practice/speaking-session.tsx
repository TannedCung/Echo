"use client";

import { Loader2, Mic, RotateCcw, Sparkles, Square } from "lucide-react";

import { EchoMascot } from "@/components/mascot/echo-mascot";
import { LiveTranscript } from "@/components/practice/live-transcript";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useSpeakingSession, type SessionPhase } from "@/hooks/use-speaking-session";

const STATUS: Partial<Record<SessionPhase, string>> = {
  examiner: "Echo is speaking…",
  thinking: "Echo is thinking…",
  ready: "Your turn — tap to answer",
  recording: "Listening… speak now, then tap done",
};

export function SpeakingSession() {
  const session = useSpeakingSession("part1");

  if (session.phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <EchoMascot state="idle" size="lg" />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">IELTS Speaking — Part 1</h1>
          <p className="text-muted-foreground mx-auto max-w-md">
            Echo will ask a few familiar questions. Answer out loud, then tap done — you&apos;ll
            need to allow microphone access.
          </p>
        </div>
        <Button size="lg" onClick={session.start}>
          Start session
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <EchoMascot state={session.mascotState} size="lg" />

      {STATUS[session.phase] && (
        <p aria-live="polite" className="text-muted-foreground text-sm font-medium">
          {STATUS[session.phase]}
        </p>
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
        {session.phase === "recording" && (
          <Button size="lg" variant="accent" onClick={session.submitAnswer}>
            <Square className="size-4" aria-hidden /> Done answering
          </Button>
        )}
        {(session.phase === "examiner" || session.phase === "thinking") && (
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

      {session.phase === "complete" && (
        <Card className="bg-primary/5 flex w-full flex-col items-center gap-3 text-center">
          <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full">
            <Sparkles className="size-6" aria-hidden />
          </span>
          <CardTitle>Nice work — Part 1 complete!</CardTitle>
          <CardDescription className="max-w-sm">
            Band scoring against the official descriptors arrives in the next build. For now, you
            can run through the questions again.
          </CardDescription>
          <Button onClick={session.start} variant="outline">
            <RotateCcw className="size-4" aria-hidden /> Practice again
          </Button>
        </Card>
      )}
    </div>
  );
}
