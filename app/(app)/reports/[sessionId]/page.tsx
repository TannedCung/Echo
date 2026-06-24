import { ArrowLeft, Mic } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScoreReport } from "@/components/reports/score-report";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db/client";
import { getSpeakingReport } from "@/lib/db/queries/sessions";

export const metadata = { title: "Your speaking report — Echo" };

export default async function ReportPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await auth();
  if (!session?.user?.id || !isDbConfigured) {
    notFound();
  }

  const report = await getSpeakingReport(sessionId, session.user.id).catch(() => null);
  if (!report?.score) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Your speaking report</h1>
        <p className="text-muted-foreground">
          Scored against the official IELTS Speaking band descriptors.
        </p>
      </div>

      <ScoreReport scoring={report.score.feedback} transcript={report.turns} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/practice/speaking">
            <Mic className="size-4" aria-hidden /> Practice again
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
