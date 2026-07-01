import type { BandTable, ObjectiveQuestion } from "./objective-scoring";

/**
 * The Listening paper library. Each test is a short spoken passage (a talk or
 * announcement) that Echo reads aloud through the TTS pipeline, followed by
 * objective questions graded by `objective-scoring.ts`. The `transcript` is what
 * gets synthesised and is hidden from the candidate while they answer — it is
 * only revealed afterwards in the report, so the exercise tests listening rather
 * than reading. Where TTS is unavailable, the surface falls back to letting the
 * candidate read the transcript, with a clear note.
 *
 * Scripts are original, Echo-authored monologues designed for a single narrator
 * voice.
 */

export interface ListeningTest {
  id: string;
  /** Human-friendly title, e.g. "Welcome to the city library". */
  title: string;
  /** Short description of the audio context shown before playback. */
  context: string;
  level: string;
  /** The spoken script, as ordered paragraphs, sent to TTS and shown in review. */
  transcript: string[];
  questions: ObjectiveQuestion[];
}

export const LISTENING_TESTS: ListeningTest[] = [
  {
    id: "community-garden-induction",
    title: "Community garden induction",
    context:
      "You will hear a volunteer coordinator giving a short induction talk to new members of a community garden.",
    level: "Bands 5.5–6.5",
    transcript: [
      "Hello everyone, and a very warm welcome to the Riverside Community Garden. My name is Dana, and I'm the volunteer coordinator, so I'll be your main point of contact for your first few weeks here.",
      "Let me start with the practical details. The garden is open from eight in the morning until dusk, seven days a week. Volunteers can come whenever suits them, but we do ask that you sign in at the shed by the main gate each time, mainly so we know who's on site in case of an emergency.",
      "Your membership includes access to all the shared tools, which you'll find in the green storage container, not the wooden shed — that one's just for seeds and paperwork. Please give the tools a quick clean before you put them back. The one thing we ask you to bring yourself is a pair of sturdy gloves, as we don't provide those.",
      "Each new member is given a small plot of their own, roughly three metres by two, and you're free to grow whatever you like on it, with one exception: we don't allow anything that spreads aggressively, like mint, because it quickly takes over the neighbouring plots.",
      "We hold a working day on the first Saturday of every month, starting at ten. That's when we tackle the bigger jobs together, like repairing paths and clearing the pond. Lunch is provided on those days, and it's honestly the best way to get to know the other members, so do come along if you can.",
      "Finally, if you have any questions during the week, the quickest way to reach me is by email rather than by phone, as I'm often out in the garden. My address is on the noticeboard by the gate. That's everything from me — enjoy your first season, and don't be afraid to ask for help.",
    ],
    questions: [
      {
        id: "l1-q1",
        type: "short-answer",
        prompt: "What is the name of the volunteer coordinator?",
        answers: ["Dana"],
        wordLimit: "One word",
      },
      {
        id: "l1-q2",
        type: "multiple-choice",
        prompt: "When is the garden open?",
        options: [
          "Weekdays only, from eight until dusk.",
          "Every day, from eight in the morning until dusk.",
          "Every day, twenty-four hours.",
          "Weekends only, from ten until dusk.",
        ],
        answers: ["Every day, from eight in the morning until dusk."],
      },
      {
        id: "l1-q3",
        type: "short-answer",
        prompt: "Where must volunteers sign in each time they arrive?",
        answers: ["the shed", "shed", "at the shed"],
        wordLimit: "No more than two words",
      },
      {
        id: "l1-q4",
        type: "multiple-choice",
        prompt: "Where are the shared tools kept?",
        options: [
          "In the wooden shed.",
          "In the green storage container.",
          "By the main gate.",
          "In each member's plot.",
        ],
        answers: ["In the green storage container."],
      },
      {
        id: "l1-q5",
        type: "short-answer",
        prompt: "What single item are volunteers asked to bring themselves?",
        answers: ["gloves", "a pair of gloves", "sturdy gloves"],
        wordLimit: "No more than three words",
      },
      {
        id: "l1-q6",
        type: "true-false-notgiven",
        prompt: "Members can grow any plant they wish on their plot.",
        answers: ["False"],
      },
      {
        id: "l1-q7",
        type: "short-answer",
        prompt: "Which plant is given as an example of one that is not allowed?",
        answers: ["mint"],
        wordLimit: "One word",
      },
      {
        id: "l1-q8",
        type: "multiple-choice",
        prompt: "When is the monthly working day held?",
        options: [
          "The last Sunday of the month.",
          "Every Saturday.",
          "The first Saturday of the month.",
          "The first Monday of the month.",
        ],
        answers: ["The first Saturday of the month."],
      },
      {
        id: "l1-q9",
        type: "true-false-notgiven",
        prompt: "Lunch is provided on the monthly working days.",
        answers: ["True"],
      },
      {
        id: "l1-q10",
        type: "multiple-choice",
        prompt: "What is the best way to contact the coordinator during the week?",
        options: ["By phone", "By email", "In person at the shed", "Through the noticeboard"],
        answers: ["By email"],
      },
    ],
  },
  {
    id: "museum-tour-briefing",
    title: "Museum tour briefing",
    context: "You will hear a guide briefing a group before a tour of a maritime museum.",
    level: "Bands 6–7",
    transcript: [
      "Good morning, everyone, and welcome to the National Maritime Museum. Before we begin the tour, I'd just like to run through a few points so that everything goes smoothly.",
      "The tour lasts about ninety minutes in total, and we'll be covering three of the museum's main galleries. We'll start upstairs in the Age of Sail gallery, then move down to the Trade and Empire rooms, and finish in the newest gallery, which opened only last spring and focuses on modern shipping.",
      "A quick word about photography. You're very welcome to take photos in most of the museum, but please switch off your flash, as it can damage some of the older documents on display. There is one room, the map room, where photography of any kind is not permitted at all, and I'll remind you again when we get there.",
      "If we happen to get separated, don't worry. Simply make your way to the main entrance hall, where there's a large model ship in the centre, and wait for me there. Please don't try to find the group on your own, as the building is larger than it looks.",
      "At the halfway point we'll stop for around fifteen minutes in the café on the ground floor. It's a good chance to rest, and I'd recommend the coffee, though I should warn you the café doesn't take cash — card payments only.",
      "Finally, the gift shop is next to the exit, and it stays open for half an hour after the tour ends, so there's no need to rush your shopping. Right — if there are no questions, let's make our way to the stairs and begin.",
    ],
    questions: [
      {
        id: "l2-q1",
        type: "short-answer",
        prompt: "How long does the whole tour last?",
        answers: ["ninety minutes", "90 minutes", "ninety", "an hour and a half"],
        wordLimit: "No more than two words",
      },
      {
        id: "l2-q2",
        type: "multiple-choice",
        prompt: "Which gallery will the group visit first?",
        options: [
          "The Trade and Empire rooms",
          "The Age of Sail gallery",
          "The modern shipping gallery",
          "The map room",
        ],
        answers: ["The Age of Sail gallery"],
      },
      {
        id: "l2-q3",
        type: "true-false-notgiven",
        prompt: "The gallery on modern shipping is the museum's newest.",
        answers: ["True"],
      },
      {
        id: "l2-q4",
        type: "multiple-choice",
        prompt: "What are visitors asked to do about photography?",
        options: [
          "Take no photographs anywhere.",
          "Use flash only in the map room.",
          "Turn off their flash.",
          "Ask permission in every room.",
        ],
        answers: ["Turn off their flash."],
      },
      {
        id: "l2-q5",
        type: "short-answer",
        prompt: "In which room is photography completely forbidden?",
        answers: ["the map room", "map room"],
        wordLimit: "No more than two words",
      },
      {
        id: "l2-q6",
        type: "short-answer",
        prompt:
          "If separated, visitors should wait by the large model ship in which part of the museum?",
        answers: [
          "the entrance hall",
          "entrance hall",
          "main entrance hall",
          "the main entrance hall",
        ],
        wordLimit: "No more than three words",
      },
      {
        id: "l2-q7",
        type: "multiple-choice",
        prompt: "How long is the break at the café?",
        options: [
          "Around ten minutes",
          "Around fifteen minutes",
          "Around thirty minutes",
          "Around five minutes",
        ],
        answers: ["Around fifteen minutes"],
      },
      {
        id: "l2-q8",
        type: "true-false-notgiven",
        prompt: "The café accepts payment in cash.",
        answers: ["False"],
      },
      {
        id: "l2-q9",
        type: "short-answer",
        prompt: "For how long does the gift shop stay open after the tour?",
        answers: ["half an hour", "thirty minutes", "30 minutes"],
        wordLimit: "No more than three words",
      },
      {
        id: "l2-q10",
        type: "true-false-notgiven",
        prompt: "The guide says the building is smaller than it appears.",
        answers: ["False"],
      },
    ],
  },
];

/**
 * Listening raw→band conversion (out of 40), from widely published IELTS
 * guidance. Ordered high→low; `rawToBand` scales shorter practice papers to /40.
 *
 * @see https://www.ielts.org/for-test-takers/how-ielts-is-scored
 */
export const LISTENING_BAND_TABLE: BandTable = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [32, 7.5],
  [30, 7],
  [26, 6.5],
  [23, 6],
  [18, 5.5],
  [16, 5],
  [13, 4.5],
  [11, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [3, 2],
  [2, 1.5],
  [1, 1],
];

/** The full text sent to TTS for a listening test. */
export function transcriptText(test: ListeningTest): string {
  return test.transcript.join("\n\n");
}

export function getListeningTest(id: string): ListeningTest | undefined {
  return LISTENING_TESTS.find((test) => test.id === id);
}

/** Deterministic pick from a seed; no seed → the first test. */
export function pickListeningTest(seed?: string): ListeningTest {
  if (!seed) return LISTENING_TESTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return LISTENING_TESTS[Math.abs(hash) % LISTENING_TESTS.length];
}
