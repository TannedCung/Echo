"use client";

import { Headphones, Loader2, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ObjectiveQuestions } from "@/components/practice/objective-questions";
import { ObjectiveReport } from "@/components/reports/objective-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { GradedQuestion, PublicQuestion } from "@/lib/ielts/objective-scoring";
import { cn } from "@/lib/utils";

export interface PublicListeningTest {
  id: string;
  title: string;
  context: string;
  level: string;
  questions: PublicQuestion[];
  /** Present only in the text fallback (when TTS is not configured). */
  transcript?: string[];
}

interface GradeResult {
  perQuestion: GradedQuestion[];
  raw: number;
  total: number;
  band: number;
}

/**
 * The Listening practice surface: play the audio (synthesised server-side so the
 * script text is never shipped), answer the questions, then grade on the server
 * and review with the transcript revealed. When TTS is unavailable the surface
 * falls back to a readable transcript, clearly flagged.
 */
export function ListeningSurface({
  tests,
  audioAvailable,
}: {
  tests: PublicListeningTest[];
  audioAvailable: boolean;
}) {
  const [testId, setTestId] = useState(tests[0].id);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"answering" | "grading" | "done">("answering");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [reviewTranscript, setReviewTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const test = tests.find((t) => t.id === testId)!;
  const answered = Object.values(responses).filter((v) => v.trim()).length;

  // Release any object URL when the clip changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function reset(nextTestId = testId) {
    if (audioRef.current) audioRef.current.pause();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setPlaying(false);
    setTestId(nextTestId);
    setResponses({});
    setResult(null);
    setReviewTranscript([]);
    setError(null);
    setStatus("answering");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function loadAndPlay() {
    if (audioUrl && audioRef.current) {
      void audioRef.current.play();
      return;
    }
    setLoadingAudio(true);
    setError(null);
    try {
      const res = await fetch("/api/listening/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't load the audio");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingAudio(false);
    }
  }

  // Autoplay once the clip has loaded.
  useEffect(() => {
    if (audioUrl && audioRef.current) void audioRef.current.play();
  }, [audioUrl]);

  async function submit() {
    setStatus("grading");
    setError(null);
    try {
      const res = await fetch("/api/listening/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId, responses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Grading failed");
      setResult(data.result);
      setReviewTranscript(data.transcript ?? test.transcript ?? []);
      setStatus("done");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError((e as Error).message);
      setStatus("answering");
    }
  }

  if (status === "done" && result) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <Badge tone="success">Listening complete</Badge>
        <ObjectiveReport
          skillLabel="Listening"
          band={result.band}
          raw={result.raw}
          total={result.total}
          perQuestion={result.perQuestion}
          review={{ label: "Audio transcript", paragraphs: reviewTranscript }}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()} variant="outline">
            <RotateCcw className="size-4" aria-hidden /> Try this clip again
          </Button>
          {tests.length > 1 && (
            <Button onClick={() => reset(tests.find((t) => t.id !== testId)!.id)} variant="ghost">
              <Headphones className="size-4" aria-hidden /> Another clip
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge tone="primary">IELTS Listening</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Listen, then answer</h1>
        <CardDescription className="max-w-md">
          Play the recording and answer the questions. You can replay it as often as you like while
          you practise.
        </CardDescription>
      </div>

      {tests.length > 1 && (
        <div
          role="radiogroup"
          aria-label="Choose a clip"
          className="flex flex-wrap justify-center gap-2"
        >
          {tests.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === testId}
              onClick={() => reset(t.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                t.id === testId
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}

      <Card tint="primary" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{test.title}</CardTitle>
          <Badge tone="neutral">{test.level}</Badge>
        </div>
        <CardDescription>{test.context}</CardDescription>

        {audioAvailable ? (
          <div className="flex items-center gap-3">
            <Button onClick={loadAndPlay} disabled={loadingAudio} variant="primary">
              {loadingAudio ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Loading…
                </>
              ) : playing ? (
                <>
                  <Pause className="size-4" aria-hidden /> Playing
                </>
              ) : (
                <>
                  <Play className="size-4" aria-hidden /> {audioUrl ? "Replay" : "Play audio"}
                </>
              )}
            </Button>
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                className="h-9 flex-1"
              >
                <track kind="captions" />
              </audio>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Badge tone="warning">Audio unavailable — reading fallback</Badge>
            <CardDescription>
              Text-to-speech isn&apos;t configured, so read the script below instead. Try not to
              look back at it while you answer.
            </CardDescription>
            <details className="text-sm">
              <summary className="text-primary cursor-pointer font-semibold">Show script</summary>
              <div className="mt-2 flex flex-col gap-2">
                {(test.transcript ?? []).map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </details>
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-5">
        <CardTitle className="text-base">Questions</CardTitle>
        <ObjectiveQuestions
          questions={test.questions}
          responses={responses}
          onChange={(id, value) => setResponses((r) => ({ ...r, [id]: value }))}
          disabled={status === "grading"}
        />
      </Card>

      {error && (
        <p className="text-destructive text-center text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-2">
        <p className="text-muted-foreground text-xs">
          {answered} of {test.questions.length} answered
        </p>
        <Button size="lg" onClick={submit} disabled={status === "grading"}>
          {status === "grading" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Grading…
            </>
          ) : (
            "Submit for scoring"
          )}
        </Button>
      </div>
    </div>
  );
}
