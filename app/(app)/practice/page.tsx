import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PRACTICE_SKILLS } from "@/components/practice/practice-skills";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Practice — Echo" };

/**
 * The practice hub — one friendly entry point to all four IELTS papers. Each
 * card links to that skill's practice surface. Keeps the full test one tap away.
 */
export default function PracticeHubPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Practice</h1>
        <p className="text-muted-foreground">
          Choose a paper to practise. Every session ends with a band and specific ways to improve.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PRACTICE_SKILLS.map((skill) => {
          const Icon = skill.icon;
          return (
            <Link key={skill.id} href={skill.href} className="group">
              <Card
                tint={skill.tint}
                className="flex h-full flex-col gap-3 transition-shadow group-hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-background/70 flex size-10 items-center justify-center rounded-full">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle>{skill.label}</CardTitle>
                </div>
                <CardDescription>{skill.blurb}</CardDescription>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-muted-foreground text-xs">{skill.scoring}</span>
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
