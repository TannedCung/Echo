import type { WritingTaskType } from "./writing-descriptors";

/**
 * The Writing prompt library — the pool of Task 1 and Task 2 prompts Echo offers.
 * Task 1 (Academic) normally accompanies a chart or diagram; since Echo's MVP is
 * text-only, each Task 1 prompt describes its data in words so the exercise still
 * works without an image. Task 2 prompts are standard opinion/discussion essays.
 * This is the single source of truth for Writing content — surfaces render it and
 * the scorer agent is grounded on the selected prompt.
 */

export interface WritingPrompt {
  id: string;
  task: WritingTaskType;
  /** Short theme for the picker, e.g. "Remote work". */
  title: string;
  /** The full task instructions shown to the candidate. */
  prompt: string;
  /** Suggested time in minutes (20 for Task 1, 40 for Task 2). */
  suggestedMinutes: number;
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "t1-commuting-modes",
    task: "task1",
    title: "How people commute",
    suggestedMinutes: 20,
    prompt:
      "The table below shows the percentage of workers in a city who used four different modes of transport to commute in 2005 and 2020.\n\n• Car: 55% (2005) → 38% (2020)\n• Public transport: 25% (2005) → 34% (2020)\n• Cycling: 8% (2005) → 18% (2020)\n• Walking: 12% (2005) → 10% (2020)\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t1-recycling-process",
    task: "task1",
    title: "Glass recycling process",
    suggestedMinutes: 20,
    prompt:
      "The following describes the stages in the recycling of glass bottles.\n\nUsed glass bottles are first collected from households and businesses. They are then transported to a processing plant, where they are sorted by colour and cleaned. Next, the clean glass is crushed into small pieces called cullet. The cullet is melted in a furnace at high temperature, and the molten glass is moulded into new bottles. Finally, the new bottles are cooled, quality-checked, and delivered to shops.\n\nSummarise the information by describing the process as a sequence of stages. Write at least 150 words.",
  },
  {
    id: "t2-remote-work",
    task: "task2",
    title: "Remote work",
    suggestedMinutes: 40,
    prompt:
      "Many companies now allow employees to work from home for part or all of the week. Some people believe this benefits both workers and employers, while others think it does more harm than good.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
  {
    id: "t2-public-transport-funding",
    task: "task2",
    title: "Funding public transport",
    suggestedMinutes: 40,
    prompt:
      "Some people think that governments should spend money on improving public transport rather than on building new roads.\n\nTo what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
  {
    id: "t2-technology-childhood",
    task: "task2",
    title: "Technology and childhood",
    suggestedMinutes: 40,
    prompt:
      "Children today spend an increasing amount of their free time using digital devices such as tablets and smartphones. Some believe this is a positive development, while others are concerned about its effects.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
];

export function getWritingPrompt(id: string): WritingPrompt | undefined {
  return WRITING_PROMPTS.find((prompt) => prompt.id === id);
}

export function writingPromptsForTask(task: WritingTaskType): WritingPrompt[] {
  return WRITING_PROMPTS.filter((prompt) => prompt.task === task);
}

/** Deterministic pick from a seed; no seed → the first prompt. */
export function pickWritingPrompt(seed?: string): WritingPrompt {
  if (!seed) return WRITING_PROMPTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return WRITING_PROMPTS[Math.abs(hash) % WRITING_PROMPTS.length];
}
