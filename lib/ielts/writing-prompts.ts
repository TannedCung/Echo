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
  /** Optional chart, table, map, or diagram visual asset. */
  imageUrl?: string;
  imageAlt?: string;
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
  {
    id: "t1-global-energy-consumption",
    task: "task1",
    title: "Energy consumption by source",
    suggestedMinutes: 20,
    prompt:
      "The chart below shows global energy consumption by three major sources (Fossil Fuels, Nuclear, and Renewable Energy) between 2000 and 2020.\n\n• Fossil fuels: 80% (2000) → 65% (2020)\n• Renewable energy: 10% (2000) → 25% (2020)\n• Nuclear power: 10% (2000) → 10% (2020)\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t1-water-usage-by-sector",
    task: "task1",
    title: "Water usage by sector",
    suggestedMinutes: 20,
    prompt:
      "The data below presents the breakdown of global freshwater usage across three main sectors in 2020.\n\n• Agriculture: 70%\n• Industry & Manufacturing: 20%\n• Domestic & Household: 10%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t1-university-graduates-employment",
    task: "task1",
    title: "Graduate employment destinations",
    suggestedMinutes: 20,
    prompt:
      "The table below shows the destination of university graduates in one country within six months of graduation in 2010 and 2022.\n\n• Full-time employment: 62% (2010) → 71% (2022)\n• Further study: 18% (2010) → 15% (2022)\n• Part-time / Freelance: 12% (2010) → 9% (2022)\n• Unemployed: 8% (2010) → 5% (2022)\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t2-artificial-intelligence-workplace",
    task: "task2",
    title: "AI and future workforce",
    suggestedMinutes: 40,
    prompt:
      "Artificial intelligence and automation are increasingly performing tasks previously handled by human workers. Some argue this will create widespread unemployment, while others believe it will generate new and better employment opportunities.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own experience. Write at least 250 words.",
  },
  {
    id: "t2-globalisation-cultural-identity",
    task: "task2",
    title: "Globalisation & local culture",
    suggestedMinutes: 40,
    prompt:
      "Globalisation has led to similar products, media, and lifestyles being adopted in countries across the world. Some believe this leads to a loss of traditional cultural identities, while others welcome the global integration.\n\nTo what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
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
