import type { SpeakingMode } from "./examiner-flow";

/**
 * Seed question bank for the speaking examiner. Persisted to the `question_bank`
 * table (see lib/db/schema.ts) and used to ground the examiner agent so it asks
 * authentic, on-format prompts. Expanded over time / per topic.
 */

export type QuestionPart = "part1" | "part2" | "part3";

export interface QuestionItem {
  id: string;
  part: QuestionPart;
  topic: string;
  prompt: string;
  /** Part 2 cue-card bullet points, or Part 1/3 follow-up questions. */
  followUps: string[];
}

export const QUESTION_BANK: QuestionItem[] = [
  {
    id: "p1-hometown",
    part: "part1",
    topic: "Hometown",
    prompt: "Let's talk about your hometown. Where is your hometown?",
    followUps: [
      "What do you like most about it?",
      "Has it changed much since you were a child?",
      "Would you recommend it to a tourist? Why?",
    ],
  },
  {
    id: "p1-work-study",
    part: "part1",
    topic: "Work or study",
    prompt: "Do you work, or are you a student?",
    followUps: [
      "What do you enjoy most about it?",
      "Is there anything you would like to change about it?",
    ],
  },
  {
    id: "p2-memorable-trip",
    part: "part2",
    topic: "A memorable journey",
    prompt:
      "Describe a journey or trip that you remember well. You should say where you went, who you went with, what you did, and explain why it was memorable.",
    followUps: ["where you went", "who you went with", "what you did", "why it was memorable"],
  },
  {
    id: "p3-travel-tech",
    part: "part3",
    topic: "Travel and technology",
    prompt: "How has technology changed the way people travel?",
    followUps: [
      "Do you think tourism benefits local communities?",
      "Will people travel more or less in the future? Why?",
    ],
  },
];

export function questionsForMode(mode: SpeakingMode): QuestionItem[] {
  if (mode === "full_mock") return QUESTION_BANK;
  return QUESTION_BANK.filter((q) => q.part === mode);
}
