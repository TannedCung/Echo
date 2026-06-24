import { Quote, Sparkles, TrendingUp } from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";
import type { ScoringResult } from "@/lib/ai/scoring-schema";
import {
  CRITERIA_INFO,
  SPEAKING_CRITERIA,
  type SpeakingCriterion,
} from "@/lib/ielts/band-descriptors";
import { cn } from "@/lib/utils";

interface ScoreReportProps {
  scoring: ScoringResult;
  transcript?: { role: "examiner" | "candidate"; text: string; audioUrl?: string | null }[];
  className?: string;
}

/**
 * Each criterion gets its own steady brand hue (not a pass/fail colour) — the
 * meters read as calm, growth-framed, never red-for-bad. Matches the design
 * system's BandScore specimen.
 */
const CRITERION_HUE: Record<SpeakingCriterion, { text: string; bar: string }> = {
  fluencyCoherence: { text: "text-teal", bar: "bg-teal" },
  lexicalResource: { text: "text-rose", bar: "bg-rose" },
  grammaticalRange: { text: "text-sage", bar: "bg-sage" },
  pronunciation: { text: "text-warning", bar: "bg-warning" },
};

/**
 * Echo's IELTS band report — the moment the product builds toward. A prominent
 * overall band dial beside the four official criteria as calm meters, then
 * evidence quotes, growth-framed upgrades, and the annotated transcript with
 * private listen-back. Pure presentational server component.
 */
export function ScoreReport({ scoring, transcript, className }: ScoreReportProps) {
  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-6", className)}>
      <Card className="flex flex-col items-center gap-8 rounded-3xl shadow-md sm:flex-row sm:items-stretch">
        {/* Overall band dial */}
        <div className="flex min-w-[168px] flex-col items-center justify-center gap-2">
          <div
            className="bg-primary text-primary-foreground flex size-32 flex-col items-center justify-center rounded-full shadow-[var(--glow-primary)]"
            aria-label={`Overall band ${scoring.overall}`}
          >
            <span className="text-[11px] font-semibold tracking-wide uppercase opacity-85">
              Overall
            </span>
            <span className="text-5xl leading-none font-extrabold tracking-tight tabular-nums">
              {scoring.overall.toFixed(1)}
            </span>
            <span className="text-[11px] font-semibold opacity-85">band</span>
          </div>
          <span className="text-muted-foreground text-xs">estimated</span>
        </div>

        {/* Criteria meters */}
        <div className="flex flex-1 flex-col justify-center gap-5">
          <p className="text-sm leading-relaxed text-balance">{scoring.summary}</p>
          {SPEAKING_CRITERIA.map((key) => {
            const info = CRITERIA_INFO[key];
            const result = scoring[key];
            const hue = CRITERION_HUE[key];
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold">{info.label}</span>
                  <span className={cn("text-sm font-bold tabular-nums", hue.text)}>
                    {result.band.toFixed(1)}
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full" aria-hidden>
                  <div
                    className={cn("h-full rounded-full", hue.bar)}
                    style={{ width: `${(result.band / 9) * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground text-xs">{result.comment}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Evidence — the exact phrases Echo heard, grouped by criterion */}
      <Card className="flex flex-col gap-4">
        <CardTitle className="text-base">What Echo noticed</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {SPEAKING_CRITERIA.map((key) => {
            const result = scoring[key];
            if (result.evidence.length === 0) return null;
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {CRITERIA_INFO[key].short}
                </span>
                <ul className="flex flex-col gap-1.5">
                  {result.evidence.map((quote, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground bg-muted/50 flex gap-2 rounded-lg px-3 py-1.5 text-xs italic"
                    >
                      <Quote
                        className="text-muted-foreground/60 mt-0.5 size-3 shrink-0"
                        aria-hidden
                      />
                      <span>{quote}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      <Card tint="primary" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
            <TrendingUp className="size-4" aria-hidden />
          </span>
          <CardTitle className="text-base">How to reach the next band</CardTitle>
        </div>
        <ul className="flex flex-col gap-2">
          {scoring.upgrades.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <Sparkles className="text-accent mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {transcript && transcript.length > 0 && (
        <Card className="flex flex-col gap-4">
          <CardTitle className="text-base">Your conversation</CardTitle>
          <div className="flex flex-col gap-3">
            {transcript.map((turn, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-semibold">
                  {turn.role === "examiner" ? "Echo" : "You"}
                </span>
                <p
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm",
                    turn.role === "examiner" ? "bg-muted/60" : "bg-primary-soft",
                  )}
                >
                  {turn.text}
                </p>
                {turn.audioUrl && (
                  <audio
                    controls
                    preload="none"
                    src={`/api/speaking/audio?p=${encodeURIComponent(turn.audioUrl)}`}
                    className="mt-1 h-9 w-full max-w-xs"
                  >
                    <track kind="captions" />
                  </audio>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
