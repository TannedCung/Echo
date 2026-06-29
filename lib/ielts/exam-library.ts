import type { SpeakingMode } from "./examiner-flow";

/**
 * The exam library — the pool of authentic IELTS Speaking test forms the
 * examiner draws from. Each `ExamSet` is a coherent, exam-realistic form: a
 * couple of Part 1 topics, one Part 2 cue card, and a Part 3 discussion whose
 * theme follows on from the cue card (as in a real test). A session picks one
 * set (deterministically, seeded per session — see `pickExam`) so practice
 * varies run to run instead of repeating the same questions.
 *
 * This is the single source of truth for speaking content: `question-bank.ts`
 * flattens these into the seedable `question_bank` rows, and
 * `speaking-script.ts` turns a chosen set into ordered examiner moves. Both the
 * chained (Mode A) and live (Mode B) engines ground on the same library.
 */

export type QuestionPart = "part1" | "part2" | "part3";

export interface QuestionItem {
  id: string;
  part: QuestionPart;
  topic: string;
  /** The opening prompt; for Part 2 this is the cue-card task. */
  prompt: string;
  /** Part 2 cue-card bullet points, or Part 1/3 follow-up questions. */
  followUps: string[];
}

export interface ExamSet {
  id: string;
  /** Human-friendly theme, e.g. "Journeys & places". */
  title: string;
  part1: QuestionItem[];
  part2: QuestionItem;
  part3: QuestionItem;
}

export const EXAM_LIBRARY: ExamSet[] = [
  {
    id: "journeys-and-places",
    title: "Journeys & places",
    part1: [
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
        id: "p1-free-time",
        part: "part1",
        topic: "Free time",
        prompt: "What do you usually do in your free time?",
        followUps: [
          "Do you prefer relaxing alone or with other people?",
          "Has the way you spend your free time changed over the years?",
        ],
      },
    ],
    part2: {
      id: "p2-memorable-trip",
      part: "part2",
      topic: "A memorable journey",
      prompt:
        "Describe a journey or trip that you remember well. You should say where you went, who you went with, and what you did, and explain why it was memorable.",
      followUps: ["where you went", "who you went with", "what you did", "why it was memorable"],
    },
    part3: {
      id: "p3-travel-tourism",
      part: "part3",
      topic: "Travel and tourism",
      prompt: "How has technology changed the way people travel?",
      followUps: [
        "Do you think tourism benefits local communities?",
        "Will people travel more or less in the future? Why?",
      ],
    },
  },
  {
    id: "people-and-influence",
    title: "People & influence",
    part1: [
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
        id: "p1-family",
        part: "part1",
        topic: "Family and friends",
        prompt: "Do you spend more time with your family or your friends?",
        followUps: [
          "Who are you closest to in your family?",
          "How often do you see your old friends?",
        ],
      },
    ],
    part2: {
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
    part3: {
      id: "p3-role-models",
      part: "part3",
      topic: "Role models and relationships",
      prompt: "Who do young people tend to look up to most these days?",
      followUps: [
        "Do you think celebrities make good role models?",
        "How has the way people make friends changed in recent years?",
      ],
    },
  },
  {
    id: "skills-and-learning",
    title: "Skills & learning",
    part1: [
      {
        id: "p1-technology",
        part: "part1",
        topic: "Technology",
        prompt: "How often do you use a smartphone in a typical day?",
        followUps: [
          "What do you use it for the most?",
          "Do you think you spend too much time on it?",
        ],
      },
      {
        id: "p1-daily-routine",
        part: "part1",
        topic: "Daily routine",
        prompt: "What does a typical weekday look like for you?",
        followUps: [
          "Are you more productive in the morning or the evening?",
          "Would you like to change anything about your routine?",
        ],
      },
    ],
    part2: {
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
    part3: {
      id: "p3-learning-education",
      part: "part3",
      topic: "Learning and education",
      prompt: "Why do you think some people find it easier to learn new skills than others?",
      followUps: [
        "Should schools focus more on practical skills or academic knowledge?",
        "How might the way people learn change in the next few decades?",
      ],
    },
  },
  {
    id: "food-and-culture",
    title: "Food & culture",
    part1: [
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
        id: "p1-celebrations",
        part: "part1",
        topic: "Celebrations",
        prompt: "What festivals or celebrations are important in your country?",
        followUps: [
          "How do you usually celebrate them?",
          "Do you prefer big celebrations or quiet ones?",
        ],
      },
    ],
    part2: {
      id: "p2-special-meal",
      part: "part2",
      topic: "A special meal",
      prompt:
        "Describe a meal that was special to you. You should say what the meal was, where you had it, and who you shared it with, and explain why it was special.",
      followUps: [
        "what the meal was",
        "where you had it",
        "who you shared it with",
        "why it was special",
      ],
    },
    part3: {
      id: "p3-food-tradition",
      part: "part3",
      topic: "Food and tradition",
      prompt: "How have eating habits in your country changed over the last few decades?",
      followUps: [
        "Do you think traditional cooking is being lost?",
        "Should governments do more to encourage healthy eating?",
      ],
    },
  },
  {
    id: "media-and-stories",
    title: "Media & stories",
    part1: [
      {
        id: "p1-reading",
        part: "part1",
        topic: "Reading",
        prompt: "Do you enjoy reading in your free time?",
        followUps: [
          "What kind of books or articles do you like?",
          "Do you prefer reading on paper or on a screen?",
        ],
      },
      {
        id: "p1-music",
        part: "part1",
        topic: "Music",
        prompt: "What kind of music do you like to listen to?",
        followUps: [
          "Has your taste in music changed over time?",
          "Do you ever listen to music while you work or study?",
        ],
      },
    ],
    part2: {
      id: "p2-book-or-film",
      part: "part2",
      topic: "A book or film that stayed with you",
      prompt:
        "Describe a book or film that made a strong impression on you. You should say what it was, when you read or watched it, and what it was about, and explain why it stayed with you.",
      followUps: [
        "what it was",
        "when you read or watched it",
        "what it was about",
        "why it stayed with you",
      ],
    },
    part3: {
      id: "p3-media-information",
      part: "part3",
      topic: "Media and information",
      prompt: "How do most people in your country get their news these days?",
      followUps: [
        "Do you think social media has made people better or worse informed?",
        "How can people tell whether the information they read is reliable?",
      ],
    },
  },
  {
    id: "places-and-environment",
    title: "Places & environment",
    part1: [
      {
        id: "p1-weather",
        part: "part1",
        topic: "Weather",
        prompt: "What's the weather usually like where you live?",
        followUps: [
          "Which season do you like best, and why?",
          "Does the weather ever affect your plans?",
        ],
      },
      {
        id: "p1-home",
        part: "part1",
        topic: "Home",
        prompt: "Can you describe the place where you live?",
        followUps: [
          "What's your favourite room, and why?",
          "Is there anything you'd like to change about it?",
        ],
      },
    ],
    part2: {
      id: "p2-place-to-visit",
      part: "part2",
      topic: "A place you'd like to visit",
      prompt:
        "Describe a place you would like to visit in the future. You should say where it is, how you found out about it, and what you would do there, and explain why you want to go.",
      followUps: [
        "where it is",
        "how you found out about it",
        "what you would do there",
        "why you want to go",
      ],
    },
    part3: {
      id: "p3-cities-environment",
      part: "part3",
      topic: "Cities and the environment",
      prompt: "How have the towns and cities in your country changed in recent years?",
      followUps: [
        "What can be done to make cities better places to live?",
        "How important is it to protect the natural environment near where people live?",
      ],
    },
  },
];

/**
 * Pick an exam set for a session. Deterministic in the seed (a per-session id),
 * so every turn of one session resolves to the same set, while different
 * sessions vary. No seed → the first (curated) set, for stable defaults/tests.
 */
export function pickExam(seed?: string): ExamSet {
  if (!seed) return EXAM_LIBRARY[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return EXAM_LIBRARY[Math.abs(hash) % EXAM_LIBRARY.length];
}

/** Look up a specific exam set by id, if you need to pin one. */
export function getExam(id: string): ExamSet | undefined {
  return EXAM_LIBRARY.find((exam) => exam.id === id);
}

/** Every question across the library, flattened — Part 1 topics, then 2, then 3. */
export function allQuestions(): QuestionItem[] {
  return EXAM_LIBRARY.flatMap((exam) => [...exam.part1, exam.part2, exam.part3]);
}

/** All questions for a part across the whole library. */
export function questionsForPart(part: QuestionPart): QuestionItem[] {
  return allQuestions().filter((q) => q.part === part);
}

/** Library questions relevant to a mode (a single part, or all for a full mock). */
export function questionsForMode(mode: SpeakingMode): QuestionItem[] {
  if (mode === "full_mock") return allQuestions();
  return allQuestions().filter((q) => q.part === mode);
}
