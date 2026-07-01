import { ArrowLeft, PenLine } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WritingReport } from "@/components/reports/writing-report";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db/client";
import { getWritingReport } from "@/lib/db/queries/writing";

export const metadata = { title: "Your writing report — Echo" };

export default async function WritingReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || !isDbConfigured) {
    notFound();
  }

  const report = await getWritingReport(id, session.user.id).catch(() => null);
  if (!report?.score) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Your writing report</h1>
        <p className="text-muted-foreground">
          Scored against the official IELTS Writing band descriptors.
        </p>
      </div>

      <WritingReport
        scoring={report.score.feedback}
        task={report.submission.task}
        prompt={report.submission.prompt}
        response={report.submission.response}
        wordCount={report.submission.wordCount}
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/practice/writing">
            <PenLine className="size-4" aria-hidden /> Write another
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
