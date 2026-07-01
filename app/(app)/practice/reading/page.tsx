import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ReadingSurface, type PublicReadingTest } from "@/components/practice/reading-surface";
import { Button } from "@/components/ui/button";
import { toPublicQuestion } from "@/lib/ielts/objective-scoring";
import { READING_TESTS } from "@/lib/ielts/reading-tests";

export const metadata = { title: "Reading practice — Echo" };

export default function ReadingPracticePage() {
  // Strip the answer key before it reaches the client — grading is server-side.
  const tests: PublicReadingTest[] = READING_TESTS.map((test) => ({
    id: test.id,
    title: test.title,
    level: test.level,
    passage: test.passage,
    questions: test.questions.map(toPublicQuestion),
  }));

  return (
    <div className="flex flex-col items-center gap-10">
      <ReadingSurface tests={tests} />

      <Button asChild variant="ghost" size="sm">
        <Link href="/practice">
          <ArrowLeft className="size-4" aria-hidden /> Back to practice
        </Link>
      </Button>
    </div>
  );
}
