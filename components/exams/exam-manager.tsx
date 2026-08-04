"use client";

import {
  BookOpen,
  Eye,
  FileText,
  Filter,
  Headphones,
  Mic,
  PenTool,
  Play,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CreateExamDialog } from "@/components/exams/create-exam-dialog";
import { ExamInspectorDialog } from "@/components/exams/exam-inspector-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Stat } from "@/components/ui/stat";
import { Tabs } from "@/components/ui/tabs";
import { EXAM_LIBRARY, type ExamSet } from "@/lib/ielts/exam-library";
import { LISTENING_TESTS, type ListeningTest } from "@/lib/ielts/listening-tests";
import { READING_TESTS, type ReadingTest } from "@/lib/ielts/reading-tests";
import { WRITING_PROMPTS, type WritingPrompt } from "@/lib/ielts/writing-prompts";

export function ExamManager() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectItem, setInspectItem] = useState<{
    exam: ExamSet | ListeningTest | ReadingTest | WritingPrompt;
    type: "speaking" | "listening" | "reading" | "writing";
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Local state for custom added items
  const [customSpeaking, setCustomSpeaking] = useState<ExamSet[]>([]);
  const [customWriting, setCustomWriting] = useState<WritingPrompt[]>([]);

  // Combined pools
  const speakingPool = useMemo(() => [...EXAM_LIBRARY, ...customSpeaking], [customSpeaking]);
  const writingPool = useMemo(() => [...WRITING_PROMPTS, ...customWriting], [customWriting]);

  // Totals calculations
  const stats = useMemo(() => {
    const totalSpeaking = speakingPool.length;
    const totalListening = LISTENING_TESTS.length;
    const totalReading = READING_TESTS.length;
    const totalWriting = writingPool.length;

    // Total questions across skills
    const speakingQuestions = speakingPool.reduce((acc, s) => acc + s.part1.length + 1 + 1, 0);
    const listeningQuestions = LISTENING_TESTS.reduce((acc, l) => acc + l.questions.length, 0);
    const readingQuestions = READING_TESTS.reduce((acc, r) => acc + r.questions.length, 0);

    return {
      speaking: totalSpeaking,
      listening: totalListening,
      reading: totalReading,
      writing: totalWriting,
      totalItems: totalSpeaking + totalListening + totalReading + totalWriting,
      totalQuestions: speakingQuestions + listeningQuestions + readingQuestions + totalWriting,
    };
  }, [speakingPool, writingPool]);

  // Filtered Items
  const filteredSpeaking = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "speaking") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return speakingPool;
    return speakingPool.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.part1.some(
          (p) => p.topic.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q),
        ) ||
        s.part2.topic.toLowerCase().includes(q) ||
        s.part2.prompt.toLowerCase().includes(q) ||
        s.part3.topic.toLowerCase().includes(q),
    );
  }, [speakingPool, activeTab, searchQuery]);

  const filteredListening = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "listening") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return LISTENING_TESTS;
    return LISTENING_TESTS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.context.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q),
    );
  }, [activeTab, searchQuery]);

  const filteredReading = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "reading") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return READING_TESTS;
    return READING_TESTS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.passage.some((p) => p.toLowerCase().includes(q)),
    );
  }, [activeTab, searchQuery]);

  const filteredWriting = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "writing") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return writingPool;
    return writingPool.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q) ||
        w.prompt.toLowerCase().includes(q),
    );
  }, [writingPool, activeTab, searchQuery]);

  const handleSaveSpeaking = (set: ExamSet) => {
    setCustomSpeaking((prev) => [set, ...prev]);
  };

  const handleSaveWriting = (prompt: WritingPrompt) => {
    setCustomWriting((prev) => [prompt, ...prev]);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Exam Library Management</h1>
            <Badge tone="accent">Official & Custom Forms</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Browse, inspect, test, and manage exam content across all four IELTS modules.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          Add Custom Form
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Stat
          label="Speaking Forms"
          value={stats.speaking}
          hint={`${stats.speaking * 4} topic modules`}
          icon={Mic}
          tone="primary"
        />
        <Stat
          label="Listening Papers"
          value={stats.listening}
          hint={`${LISTENING_TESTS.reduce((a, b) => a + b.questions.length, 0)} questions`}
          icon={Headphones}
          tone="accent"
        />
        <Stat
          label="Reading Papers"
          value={stats.reading}
          hint={`${READING_TESTS.reduce((a, b) => a + b.questions.length, 0)} questions`}
          icon={BookOpen}
          tone="success"
        />
        <Stat
          label="Writing Prompts"
          value={stats.writing}
          hint="Task 1 & Task 2"
          icon={PenTool}
          tone="warning"
        />
      </div>

      {/* Filter and Search Toolbar */}
      <div className="border-border bg-card/60 flex flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={[
            { value: "all", label: `All (${stats.totalItems})` },
            { value: "speaking", label: `Speaking (${stats.speaking})` },
            { value: "listening", label: `Listening (${stats.listening})` },
            { value: "reading", label: `Reading (${stats.reading})` },
            { value: "writing", label: `Writing (${stats.writing})` },
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search topics, questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-10">
        {/* Speaking Section */}
        {filteredSpeaking.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="text-primary size-5" />
                <h2 className="text-xl font-bold tracking-tight">Speaking Exam Sets</h2>
                <Badge tone="neutral">{filteredSpeaking.length} sets</Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredSpeaking.map((set) => (
                <Card key={set.id} tint="primary" className="flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <CardTitle className="text-base">{set.title}</CardTitle>
                        <span className="text-muted-foreground font-mono text-xs">
                          ID: {set.id}
                        </span>
                      </div>
                      <Badge tone="accent">Full Mock Set</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-background/80 border-border rounded-md border p-2">
                        <span className="text-primary block font-semibold">Part 1 Topics:</span>
                        <span className="text-muted-foreground">
                          {set.part1.map((p) => p.topic).join(", ")}
                        </span>
                      </div>
                      <div className="bg-background/80 border-border rounded-md border p-2">
                        <span className="text-accent block font-semibold">Part 2 Cue Card:</span>
                        <span className="text-muted-foreground line-clamp-1">
                          {set.part2.topic}
                        </span>
                      </div>
                      <div className="bg-background/80 border-border rounded-md border p-2">
                        <span className="text-foreground block font-semibold">
                          Part 3 Discussion:
                        </span>
                        <span className="text-muted-foreground line-clamp-1">
                          {set.part3.topic}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-center justify-between border-t pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInspectItem({ exam: set, type: "speaking" })}
                    >
                      <Eye className="size-3.5" />
                      Inspect Script
                    </Button>
                    <Button size="sm" variant="primary" asChild>
                      <Link href={`/practice/speaking/chained?seed=${set.id}`}>
                        <Play className="size-3.5" />
                        Practice Form
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Listening Section */}
        {filteredListening.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="text-accent size-5" />
                <h2 className="text-xl font-bold tracking-tight">Listening Papers</h2>
                <Badge tone="neutral">{filteredListening.length} tests</Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredListening.map((test) => (
                <Card key={test.id} tint="accent" className="flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{test.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {test.context}
                        </CardDescription>
                      </div>
                      <Badge tone="accent">Target: {test.level}</Badge>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>{test.questions.length} Objective Questions</span>
                      <span>•</span>
                      <span>{test.transcript.length} Audio Blocks</span>
                    </div>
                  </div>

                  <div className="border-border flex items-center justify-between border-t pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInspectItem({ exam: test, type: "listening" })}
                    >
                      <Eye className="size-3.5" />
                      Inspect Paper & Key
                    </Button>
                    <Button size="sm" variant="accent" asChild>
                      <Link href="/practice/listening">
                        <Play className="size-3.5" />
                        Start Test
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reading Section */}
        {filteredReading.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="text-success size-5" />
                <h2 className="text-xl font-bold tracking-tight">Reading Passages</h2>
                <Badge tone="neutral">{filteredReading.length} passages</Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredReading.map((test) => (
                <Card key={test.id} tint="success" className="flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{test.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {test.passage[0]}
                        </CardDescription>
                      </div>
                      <Badge tone="success">Target: {test.level}</Badge>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>{test.passage.length} Paragraphs</span>
                      <span>•</span>
                      <span>{test.questions.length} Graded Questions</span>
                    </div>
                  </div>

                  <div className="border-border flex items-center justify-between border-t pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInspectItem({ exam: test, type: "reading" })}
                    >
                      <Eye className="size-3.5" />
                      View Passage & Key
                    </Button>
                    <Button size="sm" variant="success" asChild>
                      <Link href="/practice/reading">
                        <Play className="size-3.5" />
                        Start Passage
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Writing Section */}
        {filteredWriting.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="text-warning size-5" />
                <h2 className="text-xl font-bold tracking-tight">Writing Prompts</h2>
                <Badge tone="neutral">{filteredWriting.length} prompts</Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredWriting.map((prompt) => (
                <Card
                  key={prompt.id}
                  tint="warning"
                  className="flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{prompt.title}</CardTitle>
                        <span className="text-muted-foreground font-mono text-xs">
                          ID: {prompt.id}
                        </span>
                      </div>
                      <Badge tone="warning" className="uppercase">
                        {prompt.task} ({prompt.suggestedMinutes}m)
                      </Badge>
                    </div>

                    <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                      {prompt.prompt}
                    </p>
                  </div>

                  <div className="border-border flex items-center justify-between border-t pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInspectItem({ exam: prompt, type: "writing" })}
                    >
                      <Eye className="size-3.5" />
                      Inspect Task
                    </Button>
                    <Button size="sm" variant="primary" asChild>
                      <Link href={`/practice/writing?prompt=${prompt.id}`}>
                        <Play className="size-3.5" />
                        Write Task
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {filteredSpeaking.length === 0 &&
          filteredListening.length === 0 &&
          filteredReading.length === 0 &&
          filteredWriting.length === 0 && (
            <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
              <Sparkles className="text-muted-foreground size-10" />
              <CardTitle>No Exam Items Match Search</CardTitle>
              <CardDescription>
                Try clearing your search query or switching tabs to locate specific exam content.
              </CardDescription>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </Card>
          )}
      </div>

      {/* Inspector Dialog */}
      <ExamInspectorDialog
        exam={inspectItem?.exam ?? null}
        type={inspectItem?.type ?? null}
        onClose={() => setInspectItem(null)}
      />

      {/* Create Dialog */}
      <CreateExamDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSaveSpeaking={handleSaveSpeaking}
        onSaveWriting={handleSaveWriting}
      />
    </div>
  );
}
