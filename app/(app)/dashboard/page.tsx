import { ArrowRight, CalendarClock, Flame, Sparkles, Target } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { EchoMascot } from "@/components/mascot/echo-mascot";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { isDbConfigured } from "@/lib/db/client";
import { getSpeakingStats, type SpeakingStats } from "@/lib/db/queries/sessions";
import { getUserById } from "@/lib/db/queries/users";
import type { User } from "@/lib/db/schema";

export const metadata = { title: "Dashboard — Echo" };

function formatTestDate(date: Date | null): string {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user;
  const firstName = user.isGuest ? null : (user.name?.split(" ")[0] ?? null);

  // The profile (goal band, test date) and progress stats live in Postgres.
  // Degrade gracefully if the DB isn't reachable so the dashboard still renders.
  let profile: User | null = null;
  let stats: SpeakingStats | null = null;
  if (isDbConfigured) {
    [profile, stats] = await Promise.all([
      getUserById(user.id).catch(() => null),
      getSpeakingStats(user.id).catch(() => null),
    ]);
  }

  const hasGoal = profile?.goalBand != null;
  const streak = stats?.dayStreak ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {firstName ? `Hi ${firstName} 👋` : "Welcome 👋"}
        </h1>
        <p className="text-muted-foreground">
          Ready to practice? Hear it, say it, own it — one session at a time.
        </p>
      </div>

      {!hasGoal && (
        <Card
          tint="accent"
          className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <CardTitle>Let&apos;s set your target</CardTitle>
            <CardDescription>
              Tell Echo your goal band and test date so feedback can aim at where you&apos;re
              headed.
            </CardDescription>
          </div>
          <Button asChild variant="accent">
            <Link href="/onboarding">
              Set my goal <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Card>
      )}

      <Card
        tint="primary"
        className="flex flex-col items-center gap-6 shadow-[var(--glow-primary)] sm:flex-row sm:justify-between"
      >
        <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <CardTitle className="text-2xl">Start a speaking session</CardTitle>
          <CardDescription className="max-w-md">
            A friendly examiner asks Part 1 questions, listens as you answer, and scores you against
            the official band descriptors.
          </CardDescription>
          <Button asChild size="lg" className="mt-2">
            <Link href="/practice/speaking">
              Practice now <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <EchoMascot state="idle" size="lg" />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Flame}
          tone="warning"
          label="Day streak"
          value={streak}
          hint={streak > 0 ? "Keep it alight" : "Practice today to begin"}
        />
        <Stat
          icon={Sparkles}
          tone="success"
          label="Best band"
          value={stats?.bestBand != null ? stats.bestBand.toFixed(1) : "—"}
          hint={
            stats?.sessionCount
              ? `${stats.sessionCount} session${stats.sessionCount === 1 ? "" : "s"}`
              : "No sessions yet"
          }
        />
        <Stat
          icon={Target}
          tone="primary"
          label="Goal band"
          value={hasGoal ? String(profile!.goalBand) : "—"}
          hint={hasGoal ? "You've got this" : "Set a target"}
        />
        <Stat
          icon={CalendarClock}
          tone="accent"
          label="Test date"
          value={formatTestDate(profile?.testDate ?? null)}
          hint="Stay on track"
        />
      </div>
    </div>
  );
}
