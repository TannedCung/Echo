import type { SpeakingMode } from "./examiner-flow";

/**
 * Seed question bank for the speaking examiner. Persisted to the `question_bank`
 * table (see lib/db/schema.ts) and used to ground the examiner agent so it asks
 * authentic, on-format prompts. The flow planner (lib/ielts/speaking-script.ts)
 * selects topics from here per mode. Expanded over time / per topic.
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
  // ── Part 1 — familiar, personal topics ──
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
    id: "p1-free-time",
    part: "part1",
    topic: "Free time",
    prompt: "What do you usually do in your free time?",
    followUps: [
      "Do you prefer relaxing alone or with other people?",
      "Has the way you spend your free time changed over the years?",
    ],
  },
  {
    id: "p1-food",
    part: "part1",
    topic: "Food",
    prompt: "Let's talk about food. What kind of food do you enjoy most?",
    followUps: [
      "Do you prefer eating at home or eating out?",
      "Is there a dish from your country you'd recommend to a visitor?",
    ],
  },
  {
    id: "p1-technology",
    part: "part1",
    topic: "Technology",
    prompt: "How often do you use a smartphone in a typical day?",
    followUps: ["What do you use it for the most?", "Do you think you spend too much time on it?"],
  },

  // ── Part 2 — cue cards (long turn) ──
  {
    id: "p2-memorable-trip",
    part: "part2",
    topic: "A memorable journey",
    prompt:
      "Describe a journey or trip that you remember well. You should say where you went, who you went with, and what you did, and explain why it was memorable.",
    followUps: ["where you went", "who you went with", "what you did", "why it was memorable"],
  },
  {
    id: "p2-influential-person",
    part: "part2",
    topic: "A person who influenced you",
    prompt:
      "Describe a person who has had an important influence on your life. You should say who the person is, how you know them, and what they are like, and explain how they have influenced you.",
    followUps: [
      "who the person is",
      "how you know them",
      "what they are like",
      "how they have influenced you",
    ],
  },
  {
    id: "p2-skill-to-learn",
    part: "part2",
    topic: "A skill you'd like to learn",
    prompt:
      "Describe a skill you would like to learn. You should say what the skill is, how you would learn it, and how long it might take, and explain why you want to learn it.",
    followUps: [
      "what the skill is",
      "how you would learn it",
      "how long it might take",
      "why you want to learn it",
    ],
  },

  // ── Part 3 — abstract, two-way discussion ──
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
  {
    id: "p3-learning",
    part: "part3",
    topic: "Learning and skills",
    prompt: "Why do you think some people find it easier to learn new skills than others?",
    followUps: [
      "Should schools focus more on practical skills or academic knowledge?",
      "How might the way people learn change in the next few decades?",
    ],
  },
  {
    id: "p3-media",
    part: "part3",
    topic: "Media and information",
    prompt: "How do most people in your country get their news these days?",
    followUps: [
      "Do you think social media has made people better or worse informed?",
      "How can people tell whether the information they read is reliable?",
    ],
  },
];

/** All questions for a given part, in bank order. */
export function questionsForPart(part: QuestionPart): QuestionItem[] {
  return QUESTION_BANK.filter((q) => q.part === part);
}

/**
 * Questions relevant to a mode. Single-part modes return that part; a full mock
 * returns every part. The flow planner narrows these into an ordered script.
 */
export function questionsForMode(mode: SpeakingMode): QuestionItem[] {
  if (mode === "full_mock") return QUESTION_BANK;
  return QUESTION_BANK.filter((q) => q.part === mode);
}
