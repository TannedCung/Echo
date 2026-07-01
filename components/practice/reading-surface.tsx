"use client";

import { BookOpen, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";

import { ObjectiveQuestions } from "@/components/practice/objective-questions";
import { ObjectiveReport } from "@/components/reports/objective-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { GradedQuestion, PublicQuestion } from "@/lib/ielts/objective-scoring";
import { cn } from "@/lib/utils";

export interface PublicReadingTest {
  id: string;
  title: string;
  level: string;
  passage: string[];
  questions: PublicQuestion[];
}

interface GradeResult {
  perQuestion: GradedQuestion[];
  raw: number;
  total: number;
  band: number;
}

/**
 * The Reading practice surface: pick a passage, read it alongside the questions,
 * then submit for server-side grading and see the band with a full per-question
 * review. Correct answers live only on the server; this component never has them.
 */
export function ReadingSurface({ tests }: { tests: PublicReadingTest[] }) {
  const [testId, setTestId] = useState(tests[0].id);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"answering" | "grading" | "done">("answering");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const test = tests.find((t) => t.id === testId)!;
  const answered = Object.values(responses).filter((v) => v.trim()).length;

  function reset(nextTestId = testId) {
    setTestId(nextTestId);
    setResponses({});
    setResult(null);
    setError(null);
    setStatus("answering");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setStatus("grading");
    setError(null);
    try {
      const res = await fetch("/api/reading/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId, responses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Grading failed");
      setResult(data.result);
      setStatus("done");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError((e as Error).message);
      setStatus("answering");
    }
  }

  if (status === "done" && result) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <Badge tone="success">Reading complete</Badge>
        <ObjectiveReport
          skillLabel="Reading"
          band={result.band}
          raw={result.raw}
          total={result.total}
          perQuestion={result.perQuestion}
          review={{ label: test.title, paragraphs: test.passage }}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()} variant="outline">
            <RotateCcw className="size-4" aria-hidden /> Try this passage again
          </Button>
          {tests.length > 1 && (
            <Button onClick={() => reset(tests.find((t) => t.id !== testId)!.id)} variant="ghost">
              <BookOpen className="size-4" aria-hidden /> Another passage
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge tone="primary">IELTS Reading</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Read, then answer</h1>
        <CardDescription className="max-w-md">
          Read the passage and answer every question. There&apos;s no timer here — take the time you
          need, then submit for your band.
        </CardDescription>
      </div>

      {tests.length > 1 && (
        <div
          role="radiogroup"
          aria-label="Choose a passage"
          className="flex flex-wrap justify-center gap-2"
        >
          {tests.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === testId}
              onClick={() => reset(t.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                t.id === testId
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-3 lg:max-h-[70vh] lg:overflow-y-auto">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{test.title}</CardTitle>
            <Badge tone="neutral">{test.level}</Badge>
          </div>
          {test.passage.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {p}
            </p>
          ))}
        </Card>

        <Card className="flex flex-col gap-5 lg:max-h-[70vh] lg:overflow-y-auto">
          <CardTitle className="text-base">Questions</CardTitle>
          <ObjectiveQuestions
            questions={test.questions}
            responses={responses}
            onChange={(id, value) => setResponses((r) => ({ ...r, [id]: value }))}
            disabled={status === "grading"}
          />
        </Card>
      </div>

      {error && (
        <p className="text-destructive text-center text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-2">
        <p className="text-muted-foreground text-xs">
          {answered} of {test.questions.length} answered
        </p>
        <Button size="lg" onClick={submit} disabled={status === "grading"}>
          {status === "grading" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Grading…
            </>
          ) : (
            "Submit for scoring"
          )}
        </Button>
      </div>
    </div>
  );
}
