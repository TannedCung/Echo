import { Quote, Sparkles, TrendingUp } from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";
import type { WritingScoringResult } from "@/lib/ai/writing-scoring-schema";
import {
  criterionLabel,
  WRITING_CRITERIA,
  WRITING_CRITERIA_INFO,
  type WritingCriterion,
  type WritingTaskType,
} from "@/lib/ielts/writing-descriptors";
import { cn } from "@/lib/utils";

interface WritingReportProps {
  scoring: WritingScoringResult;
  task: WritingTaskType;
  prompt: string;
  response: string;
  wordCount: number;
  className?: string;
}

/** Each criterion gets its own calm brand hue (never red-for-bad), matching the Speaking report. */
const CRITERION_HUE: Record<WritingCriterion, { text: string; bar: string }> = {
  taskResponse: { text: "text-teal", bar: "bg-teal" },
  coherenceCohesion: { text: "text-rose", bar: "bg-rose" },
  lexicalResource: { text: "text-sage", bar: "bg-sage" },
  grammaticalRange: { text: "text-warning", bar: "bg-warning" },
};

/**
 * Echo's IELTS Writing report — a prominent overall band dial beside the four
 * official criteria as calm meters, then evidence quotes, growth-framed
 * upgrades, and the candidate's own writing alongside the prompt. Pure
 * presentational component, reused for both the live result and the saved report.
 */
export function WritingReport({
  scoring,
  task,
  prompt,
  response,
  wordCount,
  className,
}: WritingReportProps) {
  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-6", className)}>
      <Card className="flex flex-col items-center gap-8 rounded-3xl shadow-md sm:flex-row sm:items-stretch">
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

        <div className="flex flex-1 flex-col justify-center gap-5">
          <p className="text-sm leading-relaxed text-balance">{scoring.summary}</p>
          {WRITING_CRITERIA.map((key) => {
            const info = WRITING_CRITERIA_INFO[key];
            const result = scoring[key];
            const hue = CRITERION_HUE[key];
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold">{criterionLabel(key, task)}</span>
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
                <span className="sr-only">{info.description}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardTitle className="text-base">What Echo noticed</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {WRITING_CRITERIA.map((key) => {
            const result = scoring[key];
            if (result.evidence.length === 0) return null;
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {WRITING_CRITERIA_INFO[key].short}
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

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Your writing</CardTitle>
          <span className="text-muted-foreground text-xs">{wordCount} words</span>
        </div>
        <p className="text-muted-foreground bg-muted/50 rounded-xl px-4 py-3 text-xs whitespace-pre-wrap">
          {prompt}
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
      </Card>
    </div>
  );
}
