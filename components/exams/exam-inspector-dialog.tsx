"use client";

import { Check, Copy, Play, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ExamSet } from "@/lib/ielts/exam-library";
import type { ListeningTest } from "@/lib/ielts/listening-tests";
import type { ReadingTest } from "@/lib/ielts/reading-tests";
import { speakingScript } from "@/lib/ielts/speaking-script";
import type { WritingPrompt } from "@/lib/ielts/writing-prompts";

interface ExamInspectorDialogProps {
  exam: ExamSet | ListeningTest | ReadingTest | WritingPrompt | null;
  type: "speaking" | "listening" | "reading" | "writing" | null;
  onClose: () => void;
}

export function ExamInspectorDialog({ exam, type, onClose }: ExamInspectorDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!exam || !type) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(exam, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="bg-background/80 animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      <div
        className="border-border bg-card max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius)] border p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-border flex items-start justify-between border-b pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge tone="primary" className="uppercase">
                {type}
              </Badge>
              <span className="text-muted-foreground font-mono text-xs">ID: {exam.id}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{exam.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-muted rounded-full p-2 transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content based on type */}
        <div className="py-6">
          {type === "speaking" && <SpeakingDetails examSet={exam as ExamSet} />}

          {type === "listening" && <ListeningDetails test={exam as ListeningTest} />}

          {type === "reading" && <ReadingDetails test={exam as ReadingTest} />}

          {type === "writing" && <WritingDetails prompt={exam as WritingPrompt} />}
        </div>

        {/* Footer Actions */}
        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <Button variant="outline" size="sm" onClick={handleCopyJson}>
            {copied ? <Check className="text-success size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied JSON" : "Copy JSON Schema"}
          </Button>

          <div className="flex items-center gap-2">
            {type === "speaking" && (
              <Button asChild size="sm" variant="primary">
                <Link href={`/practice/speaking/chained?seed=${exam.id}`}>
                  <Play className="size-4" />
                  Practice This Form
                </Link>
              </Button>
            )}
            {type === "writing" && (
              <Button asChild size="sm" variant="primary">
                <Link href={`/practice/writing?prompt=${exam.id}`}>
                  <Play className="size-4" />
                  Write Essay
                </Link>
              </Button>
            )}
            {type === "listening" && (
              <Button asChild size="sm" variant="primary">
                <Link href="/practice/listening">
                  <Play className="size-4" />
                  Launch Listening
                </Link>
              </Button>
            )}
            {type === "reading" && (
              <Button asChild size="sm" variant="primary">
                <Link href="/practice/reading">
                  <Play className="size-4" />
                  Launch Reading
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeakingDetails({ examSet }: { examSet: ExamSet }) {
  const scriptMoves = speakingScript("full_mock", examSet.id);

  return (
    <div className="flex flex-col gap-6">
      {/* Part 1 */}
      <div>
        <h3 className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase">
          Part 1 — Introduction & Topics
        </h3>
        <div className="grid gap-3">
          {examSet.part1.map((p1, idx) => (
            <Card key={p1.id} className="p-4">
              <div className="mb-1 flex items-center gap-2">
                <Badge tone="accent">
                  Topic {idx + 1}: {p1.topic}
                </Badge>
              </div>
              <p className="text-foreground text-sm font-medium">{p1.prompt}</p>
              <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-xs">
                {p1.followUps.map((f, fIdx) => (
                  <li key={fIdx}>{f}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      {/* Part 2 */}
      <div>
        <h3 className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase">
          Part 2 — Individual Long Turn (Cue Card)
        </h3>
        <Card className="border-primary/20 bg-primary-soft/30 p-4">
          <Badge tone="primary" className="mb-2">
            {examSet.part2.topic}
          </Badge>
          <p className="text-foreground mb-3 text-sm font-medium">{examSet.part2.prompt}</p>
          <div className="bg-background/80 border-border rounded-lg border p-3 text-xs">
            <span className="mb-1 block font-semibold">Bullet points:</span>
            <ul className="text-muted-foreground list-inside list-disc space-y-0.5">
              {examSet.part2.followUps.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Part 3 */}
      <div>
        <h3 className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase">
          Part 3 — Two-way Discussion
        </h3>
        <Card className="p-4">
          <Badge tone="accent" className="mb-2">
            {examSet.part3.topic}
          </Badge>
          <p className="text-foreground text-sm font-medium">{examSet.part3.prompt}</p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-xs">
            {examSet.part3.followUps.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Full Generated Script Breakdown */}
      <div>
        <h3 className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase">
          Generated Examiner Move Script ({scriptMoves.length} turns)
        </h3>
        <div className="bg-muted/50 border-border max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3 text-xs">
          {scriptMoves.map((move, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-muted-foreground w-6 shrink-0 font-mono">#{i + 1}</span>
              <span className="text-accent shrink-0 font-semibold capitalize">{move.kind}:</span>
              <span className="text-foreground">
                {move.kind === "question"
                  ? move.text
                  : move.kind === "cue_card"
                    ? move.prompt
                    : "Session Closing & Feedback Hand-off"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListeningDetails({ test }: { test: ListeningTest }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Badge tone="accent" className="mb-2">
          Target Level: {test.level}
        </Badge>
        <p className="text-muted-foreground text-sm italic">{test.context}</p>
      </div>

      <div>
        <h3 className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
          Audio Transcript ({test.transcript.length} paragraphs)
        </h3>
        <div className="bg-muted/50 border-border text-foreground max-h-48 space-y-3 overflow-y-auto rounded-lg border p-4 text-xs leading-relaxed">
          {test.transcript.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
          Questions & Key ({test.questions.length} items)
        </h3>
        <div className="grid gap-2">
          {test.questions.map((q, idx) => (
            <div
              key={q.id}
              className="border-border bg-card flex flex-col gap-1 rounded-lg border p-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground font-semibold">
                  Q{idx + 1}. {q.prompt}
                </span>
                <Badge tone="neutral" className="text-[10px] uppercase">
                  {q.type}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <span className="text-success font-medium">Answer key:</span>
                <span className="text-foreground font-mono">{q.answers.join(" OR ")}</span>
                {q.wordLimit && <span className="italic">({q.wordLimit})</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReadingDetails({ test }: { test: ReadingTest }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Badge tone="accent" className="mb-2">
          Target Level: {test.level}
        </Badge>
        <p className="text-muted-foreground text-sm font-medium">Academic Reading Passage</p>
      </div>

      <div>
        <h3 className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
          Passage Text ({test.passage.length} paragraphs)
        </h3>
        <div className="bg-muted/50 border-border text-foreground max-h-56 space-y-3 overflow-y-auto rounded-lg border p-4 text-xs leading-relaxed">
          {test.passage.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
          Questions & Key ({test.questions.length} items)
        </h3>
        <div className="grid gap-2">
          {test.questions.map((q, idx) => (
            <div
              key={q.id}
              className="border-border bg-card flex flex-col gap-1 rounded-lg border p-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground font-semibold">
                  Q{idx + 1}. {q.prompt}
                </span>
                <Badge tone="neutral" className="text-[10px] uppercase">
                  {q.type}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <span className="text-success font-medium">Answer key:</span>
                <span className="text-foreground font-mono">{q.answers.join(" OR ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WritingDetails({ prompt }: { prompt: WritingPrompt }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge tone="primary" className="uppercase">
          {prompt.task}
        </Badge>
        <Badge tone="accent">{prompt.suggestedMinutes} mins suggested</Badge>
        <Badge tone="neutral">{prompt.task === "task1" ? "150+ words" : "250+ words"}</Badge>
      </div>

      {prompt.imageUrl && (
        <div>
          <h3 className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
            Visual Asset / Chart
          </h3>
          <div className="bg-background border-border overflow-hidden rounded-lg border p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prompt.imageUrl}
              alt={prompt.imageAlt || prompt.title}
              className="max-h-72 w-full rounded-md object-contain"
            />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
          Task Prompt
        </h3>
        <div className="bg-muted/50 border-border text-foreground rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {prompt.prompt}
        </div>
      </div>
    </div>
  );
}
