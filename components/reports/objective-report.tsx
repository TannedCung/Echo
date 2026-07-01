import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { GradedQuestion } from "@/lib/ielts/objective-scoring";
import { cn } from "@/lib/utils";

interface ObjectiveReportProps {
  /** "Reading" or "Listening", for headings. */
  skillLabel: string;
  band: number;
  raw: number;
  total: number;
  perQuestion: GradedQuestion[];
  /** The passage (Reading) or transcript (Listening), revealed for review. */
  review?: { label: string; paragraphs: string[] };
  className?: string;
}

/**
 * Report for the objective papers (Reading & Listening): an overall band dial
 * with the raw score, a warm one-line takeaway, then a per-question review
 * showing the candidate's answer against the correct one, and finally the
 * passage/transcript revealed for study. Pure presentational component, reused
 * for both the live result and the saved report.
 */
export function ObjectiveReport({
  skillLabel,
  band,
  raw,
  total,
  perQuestion,
  review,
  className,
}: ObjectiveReportProps) {
  const takeaway =
    raw === total
      ? "A flawless set — every answer on the mark. Try a harder passage next."
      : raw / total >= 0.7
        ? "Strong work. Review the few you missed and you'll push higher still."
        : "A solid start — the review below shows exactly where the marks went.";

  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-6", className)}>
      <Card className="flex flex-col items-center gap-8 rounded-3xl shadow-md sm:flex-row sm:items-stretch">
        <div className="flex min-w-[168px] flex-col items-center justify-center gap-2">
          <div
            className="bg-primary text-primary-foreground flex size-32 flex-col items-center justify-center rounded-full shadow-[var(--glow-primary)]"
            aria-label={`${skillLabel} band ${band}`}
          >
            <span className="text-[11px] font-semibold tracking-wide uppercase opacity-85">
              Band
            </span>
            <span className="text-5xl leading-none font-extrabold tracking-tight tabular-nums">
              {band.toFixed(1)}
            </span>
            <span className="text-[11px] font-semibold opacity-85">{skillLabel}</span>
          </div>
          <span className="text-muted-foreground text-xs">estimated</span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tabular-nums">
              {raw}
              <span className="text-muted-foreground text-lg font-semibold">/{total}</span>
            </span>
            <span className="text-muted-foreground text-sm">correct</span>
          </div>
          <p className="text-sm leading-relaxed text-balance">{takeaway}</p>
          <p className="text-muted-foreground text-xs">
            Band estimated from the official IELTS raw-score conversion, scaled to this practice
            set&apos;s length.
          </p>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardTitle className="text-base">Question review</CardTitle>
        <ol className="flex flex-col gap-3">
          {perQuestion.map((q, i) => (
            <li key={q.id} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  q.correct ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
                )}
                aria-hidden
              >
                {q.correct ? <Check className="size-3.5" /> : <X className="size-3.5" />}
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-medium">
                  <span className="text-muted-foreground">{i + 1}. </span>
                  {q.prompt}
                </span>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span className={q.correct ? "text-success" : "text-muted-foreground"}>
                    Your answer:{" "}
                    <span className="font-semibold">
                      {q.response.trim() || <span className="italic">(blank)</span>}
                    </span>
                  </span>
                  {!q.correct && (
                    <span className="text-foreground">
                      Correct: <span className="font-semibold">{q.correctAnswer}</span>
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {review && review.paragraphs.length > 0 && (
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{review.label}</CardTitle>
            <Badge tone="neutral">for study</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {review.paragraphs.map((p, i) => (
              <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
