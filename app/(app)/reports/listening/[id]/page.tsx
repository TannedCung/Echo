import { ArrowLeft, Headphones } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ObjectiveReport } from "@/components/reports/objective-report";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db/client";
import { getListeningReport } from "@/lib/db/queries/listening";
import { getListeningTest } from "@/lib/ielts/listening-tests";

export const metadata = { title: "Your listening report — Echo" };

export default async function ListeningReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || !isDbConfigured) {
    notFound();
  }

  const attempt = await getListeningReport(id, session.user.id).catch(() => null);
  if (!attempt) {
    notFound();
  }

  const test = getListeningTest(attempt.testId);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Your listening report</h1>
        <p className="text-muted-foreground">
          Marked to a band from the official IELTS raw-score conversion.
        </p>
      </div>

      <ObjectiveReport
        skillLabel="Listening"
        band={attempt.band}
        raw={attempt.rawScore}
        total={attempt.total}
        perQuestion={attempt.answers}
        review={test ? { label: "Audio transcript", paragraphs: test.transcript } : undefined}
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/practice/listening">
            <Headphones className="size-4" aria-hidden /> Practice again
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
