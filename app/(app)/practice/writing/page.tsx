import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { WritingSurface } from "@/components/practice/writing-surface";
import { Button } from "@/components/ui/button";
import { WRITING_PROMPTS } from "@/lib/ielts/writing-prompts";

export const metadata = { title: "Writing practice — Echo" };

export default function WritingPracticePage() {
  return (
    <div className="flex flex-col items-center gap-10">
      <WritingSurface prompts={WRITING_PROMPTS} />

      <Button asChild variant="ghost" size="sm">
        <Link href="/practice">
          <ArrowLeft className="size-4" aria-hidden /> Back to practice
        </Link>
      </Button>
    </div>
  );
}
