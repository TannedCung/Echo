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
  imageUrl?: string;
  imageAlt?: string;
}

export interface ExamSet {
  id: string;
  /** Human-friendly theme, e.g. "Journeys & places". */
  title: string;
  part1: QuestionItem[];
  part2: QuestionItem;
  part3: QuestionItem;
  imageUrl?: string;
  imageAlt?: string;
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
  {
    id: "hobbies-and-creativity",
    title: "Hobbies & creativity",
    part1: [
      {
        id: "p1-art-craft",
        part: "part1",
        topic: "Art and craft",
        prompt: "Do you enjoy making things by hand?",
        followUps: [
          "Did you do many arts and crafts when you were a child?",
          "Would you like to learn a new creative hobby in the future?",
        ],
      },
      {
        id: "p1-sports-exercise",
        part: "part1",
        topic: "Sports and exercise",
        prompt: "What sports or physical activities do you enjoy?",
        followUps: [
          "Do you prefer watching sports or playing them?",
          "Is sport popular among people in your country?",
        ],
      },
    ],
    part2: {
      id: "p2-creative-project",
      part: "part2",
      topic: "A creative project",
      prompt:
        "Describe a creative project or activity you worked on. You should say what the project was, how you worked on it, and what the outcome was, and explain how you felt about it.",
      followUps: [
        "what the project was",
        "how you worked on it",
        "what the outcome was",
        "how you felt about it",
      ],
    },
    part3: {
      id: "p3-creativity-work-education",
      part: "part3",
      topic: "Creativity in work and education",
      prompt: "Why is creativity important in modern workplaces?",
      followUps: [
        "Should schools spend more time teaching creative subjects?",
        "Can anyone become more creative, or is it an inborn talent?",
      ],
    },
  },
  {
    id: "transport-and-cities",
    title: "Transport & city life",
    part1: [
      {
        id: "p1-public-transport",
        part: "part1",
        topic: "Public transport",
        prompt: "How often do you use public transport in your city?",
        followUps: [
          "What is your favourite mode of transport, and why?",
          "Do you think public transport in your town could be improved?",
        ],
      },
      {
        id: "p1-neighbourhood",
        part: "part1",
        topic: "Neighbourhoods",
        prompt: "Can you tell me about the area where you live?",
        followUps: [
          "What facilities are available near your home?",
          "How long have you lived in this neighbourhood?",
        ],
      },
    ],
    part2: {
      id: "p2-ideal-city",
      part: "part2",
      topic: "A city you'd like to live in",
      prompt:
        "Describe a city you would like to live in for a short period of time. You should say where it is, what it is like, and what you would do there, and explain why you chose this city.",
      followUps: [
        "where it is",
        "what it is like",
        "what you would do there",
        "why you chose this city",
      ],
    },
    part3: {
      id: "p3-urban-living",
      part: "part3",
      topic: "Urban development and community",
      prompt: "What are the main advantages of living in a large metropolitan city?",
      followUps: [
        "What problems can overpopulation cause in urban areas?",
        "Do you think more people will move to rural areas in the future?",
      ],
    },
  },
  {
    id: "work-life-balance",
    title: "Work-life balance & wellbeing",
    part1: [
      {
        id: "p1-sleep-relaxation",
        part: "part1",
        topic: "Sleep and relaxation",
        prompt: "How many hours of sleep do you usually get each night?",
        followUps: [
          "What do you do when you feel stressed or overworked?",
          "Do you find it easy to switch off from work or study?",
        ],
      },
      {
        id: "p1-health-fitness",
        part: "part1",
        topic: "Health and fitness",
        prompt: "What do you do to keep healthy and active?",
        followUps: [
          "Has your attitude toward health changed since you were younger?",
          "Is eating healthy food expensive in your country?",
        ],
      },
    ],
    part2: {
      id: "p2-busy-schedule",
      part: "part2",
      topic: "A busy schedule",
      prompt:
        "Describe a time when you had to manage a very busy schedule or workload. You should say when it was, what you had to do, and how you managed your time, and explain how you felt after completing everything.",
      followUps: [
        "when it was",
        "what you had to do",
        "how you managed your time",
        "how you felt afterwards",
      ],
    },
    part3: {
      id: "p3-modern-pace-of-life",
      part: "part3",
      topic: "Pace of modern life",
      prompt: "Do you think people today lead more stressful lives than in the past?",
      followUps: [
        "How can companies help their employees maintain a healthy work-life balance?",
        "Is flexible working hours a good policy for all industries?",
      ],
    },
  },
  {
    id: "nature-and-environment",
    title: "Nature & conservation",
    part1: [
      {
        id: "p1-parks-gardens",
        part: "part1",
        topic: "Parks and gardens",
        prompt: "Are there many parks or green spaces near where you live?",
        followUps: [
          "How often do you visit parks or outdoor gardens?",
          "Why is spending time outdoors beneficial for people?",
        ],
      },
      {
        id: "p1-animals-wildlife",
        part: "part1",
        topic: "Animals and wildlife",
        prompt: "Do you have any pets, or would you like to have one?",
        followUps: [
          "What wild animals are common in your country?",
          "Did you learn about animals at school?",
        ],
      },
    ],
    part2: {
      id: "p2-environmental-rule",
      part: "part2",
      topic: "An environmental rule or initiative",
      prompt:
        "Describe an environmental rule, law, or green initiative that you agree with. You should say what the initiative is, how it works, and who it affects, and explain why you think it is beneficial.",
      followUps: [
        "what the initiative is",
        "how it works",
        "who it affects",
        "why it is beneficial",
      ],
    },
    part3: {
      id: "p3-global-conservation",
      part: "part3",
      topic: "Global environmental policies",
      prompt:
        "Who bears more responsibility for protecting the environment: individuals or governments?",
      followUps: [
        "How can international cooperation help address climate change?",
        "Will renewable energy completely replace fossil fuels in the near future?",
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
