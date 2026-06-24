import Link from "next/link";

import { auth } from "@/auth";
import { ProgressView, type ProgressSession } from "@/components/progress/progress-view";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { isDbConfigured } from "@/lib/db/client";
import { getSpeakingStats } from "@/lib/db/queries/sessions";
import { getUserById } from "@/lib/db/queries/users";
import type { SpeakingMode } from "@/lib/ielts/examiner-flow";

export const metadata = { title: "Your progress — Echo" };

const MODE_LABEL: Record<SpeakingMode, string> = {
  part1: "Part 1",
  part2: "Part 2",
  part3: "Part 3",
  full_mock: "Full mock",
};

const dateLong = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const dateShort = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });

export default async function ProgressPage() {
  const session = await auth();
  const user = session!.user;

  // No DB → no history. Show a friendly nudge rather than an empty shell.
  if (!isDbConfigured) {
    return (
      <ProgressShell>
        <Card>
          <CardDescription>
            Progress tracking needs a connected database. Your sessions will show up here once
            it&apos;s configured.
          </CardDescription>
        </Card>
      </ProgressShell>
    );
  }

  const [stats, profile] = await Promise.all([
    getSpeakingStats(user.id).catch(() => null),
    getUserById(user.id).catch(() => null),
  ]);

  const sessions: ProgressSession[] = (stats?.sessions ?? []).map((s) => ({
    id: s.id,
    modeLabel: MODE_LABEL[s.mode],
    band: s.overallBand,
    dateLabel: dateLong.format(s.startedAt),
    trendLabel: dateShort.format(s.startedAt),
  }));

  return (
    <ProgressShell>
      <ProgressView
        sessionCount={stats?.sessionCount ?? 0}
        bestBand={stats?.bestBand ?? null}
        dayStreak={stats?.dayStreak ?? 0}
        goalBand={profile?.goalBand ?? null}
        sessions={sessions}
      />
    </ProgressShell>
  );
}

function ProgressShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Your progress</h1>
        <p className="text-muted-foreground">Watch your bands climb, session by session.</p>
      </div>

      {children}

      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
