import { cn } from "@/lib/utils";

export interface TrendPoint {
  band: number;
  label: string;
}

/** Band 0–9 mapped to a 0–100% bar height. */
function heightPct(band: number): number {
  return Math.max(6, Math.min(100, (band / 9) * 100));
}

/**
 * A calm bar chart of overall band per session (oldest → newest). The most
 * recent session is highlighted in primary with a soft glow; the rest sit in
 * teal-soft. A dashed accent line marks the goal band when one is set.
 */
export function BandTrend({
  points,
  goalBand,
  className,
}: {
  points: TrendPoint[];
  goalBand?: number | null;
  className?: string;
}) {
  if (points.length === 0) {
    return (
      <p className={cn("text-muted-foreground text-sm", className)}>
        Finish a session to start your band trend.
      </p>
    );
  }

  return (
    <div className={cn("relative flex h-44 items-end gap-2", className)}>
      {goalBand != null && (
        <div
          className="border-accent/70 pointer-events-none absolute inset-x-0 border-t border-dashed"
          style={{ bottom: `${heightPct(goalBand)}%` }}
          aria-hidden
        >
          <span className="text-accent absolute -top-2 right-0 text-xs font-semibold">
            Goal {goalBand}
          </span>
        </div>
      )}

      {points.map((p, i) => {
        const latest = i === points.length - 1;
        return (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <span className="text-xs font-semibold tabular-nums">{p.band.toFixed(1)}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={cn(
                  "w-full rounded-t-md transition-all",
                  latest ? "bg-primary shadow-[var(--glow-primary)]" : "bg-primary-soft",
                )}
                style={{ height: `${heightPct(p.band)}%` }}
                title={`${p.label}: band ${p.band.toFixed(1)}`}
              />
            </div>
            <span className="text-muted-foreground w-full truncate text-center text-[0.65rem]">
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
