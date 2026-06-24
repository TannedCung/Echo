import { Quote, Sparkles, TrendingUp } from "lucide-react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { ScoringResult } from "@/lib/ai/scoring-schema";
import { CRITERIA_INFO, SPEAKING_CRITERIA } from "@/lib/ielts/band-descriptors";
import { cn } from "@/lib/utils";

interface ScoreReportProps {
  scoring: ScoringResult;
  transcript?: { role: "examiner" | "candidate"; text: string; audioUrl?: string | null }[];
  className?: string;
}

/** Band → friendly tone band, used to colour the score chips and bars. */
function bandTone(band: number): string {
  if (band >= 7) return "text-emerald-600 dark:text-emerald-400";
  if (band >= 5.5) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function BandBar({ band }: { band: number }) {
  return (
    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full" aria-hidden>
      <div
        className={cn(
          "h-full rounded-full",
          band >= 7 ? "bg-emerald-500" : band >= 5.5 ? "bg-amber-500" : "bg-rose-500",
        )}
        style={{ width: `${(band / 9) * 100}%` }}
      />
    </div>
  );
}

/**
 * Renders an IELTS Speaking band report: overall band, per-criterion scores
 * with evidence quotes, actionable upgrades, and (optionally) the annotated
 * transcript. Pure presentational server component — fed by either the live
 * scoring response or a persisted session row.
 */
export function ScoreReport({ scoring, transcript, className }: ScoreReportProps) {
  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-6", className)}>
      <Card className="from-primary/10 to-accent/5 flex flex-col items-center gap-2 bg-gradient-to-br text-center">
        <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Overall band
        </span>
        <span
          className={cn("text-6xl font-extrabold tabular-nums", bandTone(scoring.overall))}
          aria-label={`Overall band ${scoring.overall}`}
        >
          {scoring.overall.toFixed(1)}
        </span>
        <CardDescription className="max-w-md text-balance">{scoring.summary}</CardDescription>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {SPEAKING_CRITERIA.map((key) => {
          const info = CRITERIA_INFO[key];
          const result = scoring[key];
          return (
            <Card key={key} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-2">
                <CardTitle className="text-base">{info.label}</CardTitle>
                <span className={cn("text-2xl font-bold tabular-nums", bandTone(result.band))}>
                  {result.band.toFixed(1)}
                </span>
              </div>
              <BandBar band={result.band} />
              <p className="text-muted-foreground text-sm">{result.comment}</p>
              {result.evidence.length > 0 && (
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
              )}
            </Card>
          );
        })}
      </div>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
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
                    turn.role === "examiner"
                      ? "bg-muted/60"
                      : "bg-primary/5 border-primary/10 border",
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
