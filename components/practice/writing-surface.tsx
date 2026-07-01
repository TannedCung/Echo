"use client";

import { Loader2, PenLine, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { WritingReport } from "@/components/reports/writing-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { WritingScoringResult } from "@/lib/ai/writing-scoring-schema";
import {
  countWords,
  WRITING_MIN_WORDS,
  type WritingTaskType,
} from "@/lib/ielts/writing-descriptors";
import type { WritingPrompt } from "@/lib/ielts/writing-prompts";
import { cn } from "@/lib/utils";

const TASK_TABS: { value: WritingTaskType; label: string; blurb: string }[] = [
  { value: "task1", label: "Task 1", blurb: "Describe data or a process in at least 150 words." },
  {
    value: "task2",
    label: "Task 2",
    blurb: "Write an essay giving your view in at least 250 words.",
  },
];

/**
 * The Writing practice surface: choose a task and prompt, write your response
 * with a live word count, then submit for the examiner agent to score against
 * the four official Writing criteria. Shows the annotated report inline.
 */
export function WritingSurface({ prompts }: { prompts: WritingPrompt[] }) {
  const [task, setTask] = useState<WritingTaskType>("task2");
  const [promptId, setPromptId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<"writing" | "scoring" | "done">("writing");
  const [scoring, setScoring] = useState<WritingScoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const taskPrompts = useMemo(() => prompts.filter((p) => p.task === task), [prompts, task]);
  const prompt = taskPrompts.find((p) => p.id === promptId) ?? null;
  const wordCount = countWords(response);
  const minWords = WRITING_MIN_WORDS[task];

  function reset() {
    setPromptId(null);
    setResponse("");
    setScoring(null);
    setError(null);
    setStatus("writing");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!prompt) return;
    setStatus("scoring");
    setError(null);
    try {
      const res = await fetch("/api/writing/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, promptId: prompt.id, prompt: prompt.prompt, response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scoring failed");
      setScoring(data.scoring);
      setStatus("done");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError((e as Error).message);
      setStatus("writing");
    }
  }

  if (status === "done" && scoring && prompt) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <Badge tone="success">Writing scored</Badge>
        <WritingReport
          scoring={scoring}
          task={task}
          prompt={prompt.prompt}
          response={response}
          wordCount={wordCount}
        />
        <Button onClick={reset} variant="outline">
          <RotateCcw className="size-4" aria-hidden /> Write another
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge tone="primary">IELTS Writing</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Put it in writing</h1>
        <CardDescription className="max-w-md">
          Pick a task, respond in your own words, and Echo will score it against the four official
          Writing criteria with specific ways to improve.
        </CardDescription>
      </div>

      <div role="radiogroup" aria-label="Choose a task" className="flex justify-center gap-2">
        {TASK_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={task === t.value}
            onClick={() => {
              setTask(t.value);
              setPromptId(null);
            }}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
              task === t.value
                ? "border-primary bg-primary-soft text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="flex flex-col gap-3">
        <CardTitle className="text-base">Choose a prompt</CardTitle>
        <div className="flex flex-col gap-2">
          {taskPrompts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPromptId(p.id)}
              className={cn(
                "rounded-[var(--radius-md)] border px-4 py-2 text-left text-sm transition-colors",
                p.id === promptId
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:bg-muted",
              )}
            >
              <span className="font-semibold">{p.title}</span>
              <span className="text-muted-foreground"> · ~{p.suggestedMinutes} min</span>
            </button>
          ))}
        </div>
      </Card>

      {prompt && (
        <>
          <Card tint="accent" className="flex flex-col gap-2">
            <CardTitle className="text-base">Your task</CardTitle>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{prompt.prompt}</p>
          </Card>

          <div className="flex flex-col gap-2">
            <label htmlFor="writing-response" className="text-sm font-semibold">
              Your response
            </label>
            <textarea
              id="writing-response"
              value={response}
              disabled={status === "scoring"}
              onChange={(e) => setResponse(e.target.value)}
              rows={14}
              placeholder="Start writing here…"
              className="border-input bg-card text-foreground focus-visible:ring-ring focus-visible:ring-offset-background min-h-[16rem] w-full rounded-[var(--radius-md)] border p-4 text-sm leading-relaxed transition-[box-shadow,border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
            <div className="flex items-center justify-between text-xs">
              <span
                className={cn(
                  "font-medium",
                  wordCount >= minWords ? "text-success" : "text-muted-foreground",
                )}
              >
                {wordCount} words
              </span>
              <span className="text-muted-foreground">
                {wordCount >= minWords
                  ? "You've met the minimum length."
                  : `Aim for at least ${minWords} words.`}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-center text-sm" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-center">
            <Button size="lg" onClick={submit} disabled={status === "scoring" || wordCount < 20}>
              {status === "scoring" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Scoring…
                </>
              ) : (
                <>
                  <PenLine className="size-4" aria-hidden /> Submit for scoring
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
