"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExamSet } from "@/lib/ielts/exam-library";
import type { WritingPrompt } from "@/lib/ielts/writing-prompts";

interface CreateExamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSpeaking: (set: ExamSet) => void;
  onSaveWriting: (prompt: WritingPrompt) => void;
}

export function CreateExamDialog({
  isOpen,
  onClose,
  onSaveSpeaking,
  onSaveWriting,
}: CreateExamDialogProps) {
  const [skill, setSkill] = useState<"speaking" | "writing">("speaking");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");

  // Speaking state
  const [p1Topic, setP1Topic] = useState("");
  const [p1Prompt, setP1Prompt] = useState("");
  const [p1FollowUp1, setP1FollowUp1] = useState("");
  const [p1FollowUp2, setP1FollowUp2] = useState("");

  const [p2Topic, setP2Topic] = useState("");
  const [p2Prompt, setP2Prompt] = useState("");
  const [p2Bullet1, setP2Bullet1] = useState("");
  const [p2Bullet2, setP2Bullet2] = useState("");

  const [p3Topic, setP3Topic] = useState("");
  const [p3Prompt, setP3Prompt] = useState("");
  const [p3FollowUp1, setP3FollowUp1] = useState("");

  // Writing state
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [writingPromptText, setWritingPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.url);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = (id || title).toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (skill === "speaking") {
      const newSet: ExamSet = {
        id: cleanId || `custom-speaking-${Date.now()}`,
        title: title || "Custom Speaking Exam",
        part1: [
          {
            id: `${cleanId}-p1-1`,
            part: "part1",
            topic: p1Topic || "General Topic",
            prompt: p1Prompt || "Tell me about your daily routine.",
            followUps: [
              p1FollowUp1 || "What do you like about it?",
              p1FollowUp2 || "Has it changed recently?",
            ].filter(Boolean),
          },
        ],
        part2: {
          id: `${cleanId}-p2`,
          part: "part2",
          topic: p2Topic || "A Memorable Experience",
          prompt: p2Prompt || "Describe an interesting experience you had recently.",
          followUps: [p2Bullet1 || "what happened", p2Bullet2 || "why it was memorable"].filter(
            Boolean,
          ),
        },
        part3: {
          id: `${cleanId}-p3`,
          part: "part3",
          topic: p3Topic || "Future Trends",
          prompt: p3Prompt || "How might this change in the future?",
          followUps: [p3FollowUp1 || "Do you think people will adapt easily?"].filter(Boolean),
        },
      };
      onSaveSpeaking(newSet);
    } else {
      const newPrompt: WritingPrompt = {
        id: cleanId || `custom-writing-${Date.now()}`,
        task: taskType,
        title: title || "Custom Writing Task",
        suggestedMinutes: taskType === "task1" ? 20 : 40,
        prompt: writingPromptText || "Write your essay here.",
        imageUrl: imageUrl || undefined,
      };
      onSaveWriting(newPrompt);
    }

    onClose();
  };

  return (
    <div
      className="bg-background/80 animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      <div
        className="border-border bg-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius)] border p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border flex items-center justify-between border-b pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight">Add Custom Exam Content</h2>
            <p className="text-muted-foreground text-xs">
              Create a custom test form to practice or deploy to session memory.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-muted-foreground hover:bg-muted rounded-full p-2 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-5 text-sm">
          {/* Skill selector */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-24 font-semibold">Module:</span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={skill === "speaking" ? "primary" : "outline"}
                onClick={() => setSkill("speaking")}
              >
                Speaking Form
              </Button>
              <Button
                type="button"
                size="sm"
                variant={skill === "writing" ? "primary" : "outline"}
                onClick={() => setSkill("writing")}
              >
                Writing Task
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                Title
              </label>
              <Input
                placeholder="e.g. Digital Innovation & Society"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                ID (slug)
              </label>
              <Input
                placeholder="e.g. digital-innovation"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>

          {skill === "speaking" ? (
            <div className="border-border space-y-4 border-t pt-4">
              {/* Part 1 */}
              <div className="space-y-2">
                <Badge tone="accent">Part 1 Topic</Badge>
                <Input
                  placeholder="Part 1 Topic (e.g. Technology)"
                  value={p1Topic}
                  onChange={(e) => setP1Topic(e.target.value)}
                />
                <Input
                  placeholder="Part 1 Prompt (e.g. How often do you use modern gadgets?)"
                  value={p1Prompt}
                  onChange={(e) => setP1Prompt(e.target.value)}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Follow-up Q1"
                    value={p1FollowUp1}
                    onChange={(e) => setP1FollowUp1(e.target.value)}
                  />
                  <Input
                    placeholder="Follow-up Q2"
                    value={p1FollowUp2}
                    onChange={(e) => setP1FollowUp2(e.target.value)}
                  />
                </div>
              </div>

              {/* Part 2 */}
              <div className="border-border space-y-2 border-t pt-3">
                <Badge tone="primary">Part 2 Cue Card</Badge>
                <Input
                  placeholder="Part 2 Topic (e.g. A favourite piece of technology)"
                  value={p2Topic}
                  onChange={(e) => setP2Topic(e.target.value)}
                />
                <textarea
                  className="border-border bg-background focus-visible:ring-ring w-full rounded-md border p-3 text-xs focus-visible:ring-2 focus-visible:outline-none"
                  rows={2}
                  placeholder="Part 2 Prompt (e.g. Describe a piece of technology that you use often...)"
                  value={p2Prompt}
                  onChange={(e) => setP2Prompt(e.target.value)}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Cue bullet point 1"
                    value={p2Bullet1}
                    onChange={(e) => setP2Bullet1(e.target.value)}
                  />
                  <Input
                    placeholder="Cue bullet point 2"
                    value={p2Bullet2}
                    onChange={(e) => setP2Bullet2(e.target.value)}
                  />
                </div>
              </div>

              {/* Part 3 */}
              <div className="border-border space-y-2 border-t pt-3">
                <Badge tone="accent">Part 3 Discussion</Badge>
                <Input
                  placeholder="Part 3 Topic (e.g. Automation & Future Work)"
                  value={p3Topic}
                  onChange={(e) => setP3Topic(e.target.value)}
                />
                <Input
                  placeholder="Part 3 Prompt (e.g. Will robots replace human workers?)"
                  value={p3Prompt}
                  onChange={(e) => setP3Prompt(e.target.value)}
                />
                <Input
                  placeholder="Part 3 Follow-up Q"
                  value={p3FollowUp1}
                  onChange={(e) => setP3FollowUp1(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="border-border space-y-4 border-t pt-4">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-semibold">Task Type:</span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={taskType === "task1" ? "primary" : "outline"}
                    onClick={() => setTaskType("task1")}
                  >
                    Task 1 (Report)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={taskType === "task2" ? "primary" : "outline"}
                    onClick={() => setTaskType("task2")}
                  >
                    Task 2 (Essay)
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                  Visual Chart / Diagram Asset (Cloudflare R2 S3 Upload)
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-muted-foreground file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-xs file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                  />
                  <Input
                    placeholder="Or paste direct image URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-xs"
                  />
                  {uploading && (
                    <span className="text-accent animate-pulse text-xs">
                      Uploading to Cloudflare R2 S3...
                    </span>
                  )}
                  {imageUrl && (
                    <div className="bg-background border-border flex max-h-32 justify-center overflow-hidden rounded-md border p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Uploaded chart preview"
                        className="max-h-28 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-border flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Plus className="size-4" />
              Save Custom Content
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
