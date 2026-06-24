import { Card, CardTitle } from "@/components/ui/card";
import type { CueCard as CueCardData } from "@/lib/ielts/speaking-script";
import { cn } from "@/lib/utils";

/** Formats a remaining-seconds count as `m:ss` for the prep / talk timers. */
function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * The Part 2 long-turn cue card. Shows the topic, the bullet prompts, and a
 * live countdown — labelled "Prep" while the candidate makes notes and "Talk"
 * once they're speaking. Purely presentational; the session hook owns timing.
 */
export function CueCard({
  cueCard,
  phase,
  secondsLeft,
  className,
}: {
  cueCard: CueCardData;
  phase: "prep" | "talk";
  secondsLeft: number | null;
  className?: string;
}) {
  const isPrep = phase === "prep";

  return (
    <Card tint="warning" className={cn("flex w-full max-w-xl flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-warning text-xs font-semibold tracking-wide uppercase">
            Part 2 · Cue card
          </span>
          <CardTitle className="text-xl">{cueCard.prompt}</CardTitle>
        </div>
        {secondsLeft != null && (
          <div className="flex flex-col items-center" aria-live="polite">
            <span className="text-warning font-mono text-2xl font-bold tabular-nums">
              {formatClock(Math.max(secondsLeft, 0))}
            </span>
            <span className="text-muted-foreground text-xs font-medium">
              {isPrep ? "Prep" : "Talk"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-sm font-medium">You should say:</span>
        <ul className="flex flex-col gap-1">
          {cueCard.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm">
              <span className="bg-warning mt-1.5 size-1.5 shrink-0 rounded-full" aria-hidden />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-muted-foreground text-xs">
        {isPrep
          ? "Make a few notes — you'll speak for one to two minutes."
          : "Keep going until the timer runs out."}
      </p>
    </Card>
  );
}
