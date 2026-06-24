"use client";

import { CalendarDays, ChevronRight, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BandTrend, type TrendPoint } from "@/components/progress/band-trend";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Tabs } from "@/components/ui/tabs";

export interface ProgressSession {
  id: string;
  modeLabel: string;
  band: number | null;
  dateLabel: string;
  trendLabel: string;
}

interface ProgressViewProps {
  sessionCount: number;
  bestBand: number | null;
  dayStreak: number;
  goalBand: number | null;
  /** Newest first — the order the history list and stats expect. */
  sessions: ProgressSession[];
}

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "history", label: "History" },
];

export function ProgressView({
  sessionCount,
  bestBand,
  dayStreak,
  goalBand,
  sessions,
}: ProgressViewProps) {
  const [tab, setTab] = useState("overview");

  // The trend reads left-to-right oldest → newest; cap it so it stays legible.
  const trend: TrendPoint[] = sessions
    .filter((s) => s.band != null)
    .slice(0, 8)
    .reverse()
    .map((s) => ({ band: s.band!, label: s.trendLabel }));

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <Tabs tabs={TABS} value={tab} onValueChange={setTab} aria-label="Progress views" />

      {tab === "overview" ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              icon={Sparkles}
              tone="success"
              label="Best band"
              value={bestBand != null ? bestBand.toFixed(1) : "—"}
            />
            <Stat icon={CalendarDays} tone="primary" label="Sessions" value={sessionCount} />
            <Stat icon={Flame} tone="warning" label="Day streak" value={dayStreak} />
          </div>

          <Card className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Band trend</CardTitle>
              <CardDescription>Your overall band across recent sessions.</CardDescription>
            </div>
            <BandTrend points={trend} goalBand={goalBand} />
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.length === 0 ? (
            <Card>
              <CardDescription>
                No sessions yet — your practice history will appear here.
              </CardDescription>
            </Card>
          ) : (
            sessions.map((s) => (
              <Link key={s.id} href={`/reports/${s.id}`} className="group">
                <Card className="hover:border-primary/40 flex items-center gap-4 py-4 transition-colors">
                  <span className="bg-primary-soft text-primary flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold">
                    {s.band != null ? s.band.toFixed(1) : "—"}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-semibold">Speaking session</span>
                    <span className="text-muted-foreground text-xs">{s.dateLabel}</span>
                  </div>
                  <Badge tone="neutral">{s.modeLabel}</Badge>
                  <ChevronRight
                    className="text-muted-foreground group-hover:text-foreground size-5 shrink-0 transition-colors"
                    aria-hidden
                  />
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
