import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SpeakingSession } from "@/components/practice/speaking-session";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Speaking practice — Echo" };

export default function SpeakingPracticePage() {
  return (
    <div className="flex flex-col items-center gap-10">
      <SpeakingSession />

      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
