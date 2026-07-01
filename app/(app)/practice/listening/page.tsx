import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  ListeningSurface,
  type PublicListeningTest,
} from "@/components/practice/listening-surface";
import { Button } from "@/components/ui/button";
import { isTtsConfigured } from "@/lib/env";
import { LISTENING_TESTS } from "@/lib/ielts/listening-tests";
import { toPublicQuestion } from "@/lib/ielts/objective-scoring";

export const metadata = { title: "Listening practice — Echo" };

export default function ListeningPracticePage() {
  // When TTS is configured the transcript is never sent to the client (audio is
  // synthesised server-side); otherwise it's shipped as a readable fallback.
  const tests: PublicListeningTest[] = LISTENING_TESTS.map((test) => ({
    id: test.id,
    title: test.title,
    context: test.context,
    level: test.level,
    questions: test.questions.map(toPublicQuestion),
    transcript: isTtsConfigured ? undefined : test.transcript,
  }));

  return (
    <div className="flex flex-col items-center gap-10">
      <ListeningSurface tests={tests} audioAvailable={isTtsConfigured} />

      <Button asChild variant="ghost" size="sm">
        <Link href="/practice">
          <ArrowLeft className="size-4" aria-hidden /> Back to practice
        </Link>
      </Button>
    </div>
  );
}
