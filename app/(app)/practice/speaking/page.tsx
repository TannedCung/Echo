import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SpeakingSurface } from "@/components/practice/speaking-surface";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Speaking practice — Echo" };

export default function SpeakingPracticePage() {
  // The conversation engine (Mode A chained vs Mode B Gemini Live S2S) is a user
  // preference set in Settings; SpeakingSurface resolves it on the client.
  return (
    <div className="flex flex-col items-center gap-10">
      <SpeakingSurface />

      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
