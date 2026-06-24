import { ArrowRight, CalendarClock, Flame, Target } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { EchoMascot } from "@/components/mascot/echo-mascot";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isDbConfigured } from "@/lib/db/client";
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

  // The profile (goal band, test date) lives in Postgres. Degrade gracefully if
  // the DB isn't reachable so the dashboard still renders.
  let profile: User | null = null;
  if (isDbConfigured) {
    try {
      profile = await getUserById(user.id);
    } catch {
      profile = null;
    }
  }

  const hasGoal = profile?.goalBand != null;

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
        <Card className="border-accent/30 bg-accent/5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
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

      <Card className="bg-primary/5 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Flame} label="Day streak" value="0" hint="Practice today to begin" />
        <Stat
          icon={Target}
          label="Goal band"
          value={hasGoal ? String(profile!.goalBand) : "—"}
          hint={hasGoal ? "You've got this" : "Set a target"}
        />
        <Stat
          icon={CalendarClock}
          label="Test date"
          value={formatTestDate(profile?.testDate ?? null)}
          hint="Stay on track"
        />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-muted-foreground text-xs">{hint}</span>
    </Card>
  );
}
