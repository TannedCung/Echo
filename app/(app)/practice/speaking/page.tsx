import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LiveSpeakingSession } from "@/components/practice/live-speaking-session";
import { SpeakingSession } from "@/components/practice/speaking-session";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export const metadata = { title: "Speaking practice — Echo" };

export default function SpeakingPracticePage() {
  // Mode B (Gemini Live S2S) is gated behind a flag; default is the chained pipeline.
  const live = env.NEXT_PUBLIC_CONVERSATION_MODE === "live";

  return (
    <div className="flex flex-col items-center gap-10">
      {live ? <LiveSpeakingSession /> : <SpeakingSession />}

      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
