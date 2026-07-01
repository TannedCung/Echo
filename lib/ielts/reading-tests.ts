import type { BandTable, ObjectiveQuestion } from "./objective-scoring";

/**
 * The Reading paper library. Each test is one Academic-style passage followed by
 * a mix of question types (True/False/Not Given, multiple choice, and short
 * sentence-completion), graded objectively by `objective-scoring.ts`. Passages
 * are original, Echo-authored texts written to feel like the real thing without
 * reproducing copyrighted material. This is the single source of truth for
 * Reading content — the route grades against it and the report reviews it.
 */

export interface ReadingTest {
  id: string;
  /** Human-friendly theme, e.g. "The return of the wolf". */
  title: string;
  /** Rough band this passage is pitched at, for the picker. */
  level: string;
  /** The reading passage, as ordered paragraphs. */
  passage: string[];
  questions: ObjectiveQuestion[];
}

export const READING_TESTS: ReadingTest[] = [
  {
    id: "the-quiet-return-of-the-beaver",
    title: "The quiet return of the beaver",
    level: "Bands 6–7",
    passage: [
      "For most of the last four centuries, the European beaver was a ghost across much of its former range. Hunted relentlessly for its fur, its meat and a secretion once prized in medicine, the animal had vanished from Britain by the sixteenth century and clung on elsewhere only in a handful of isolated pockets. By 1900, fewer than 1,200 beavers were thought to survive on the entire continent. It seemed a species quietly bowing out.",
      "The reversal that followed is one of conservation's less celebrated success stories. Beginning in the 1920s, a scattering of reintroduction schemes released small groups of beavers into protected rivers. Progress was slow and often unofficial. In Britain, the animals returned not through a grand national plan but partly by accident, when individuals escaped from private collections and established themselves along quiet waterways before anyone in authority had decided whether they should be there at all.",
      "What makes the beaver's return significant is not the animal itself but what it does to the landscape. Beavers are what ecologists call a keystone species: their presence reshapes the environment in ways that benefit a great many other creatures. By felling trees and damming streams, a single family can transform a narrow channel into a chain of ponds and wetlands. These new habitats slow the flow of water, trap sediment, and create still, shallow margins where insects, fish and amphibians thrive.",
      "The benefits extend to people too, though this took longer to be recognised. The wetlands that beavers create act as natural sponges, holding back water during heavy rain and releasing it slowly in dry spells. In several catchments, researchers have measured markedly lower flood peaks downstream of beaver dams. As the cost of engineered flood defences continues to rise, some water authorities have begun to treat beavers less as a nuisance and more as unpaid labour.",
      "Not everyone is convinced. Farmers whose fields are flooded, or whose drainage ditches are blocked, tend to take a dimmer view of the animal's engineering. Flooded farmland, gnawed orchard trees and undermined riverbanks are real costs, and they fall unevenly on the people who happen to live alongside the new arrivals. Where reintroduction has been managed well, compensation schemes and the removal of problem individuals have kept local opposition manageable. Where it has been handled poorly, resentment has followed.",
      "The debate, in the end, is less about the beaver than about how much wildness a crowded, farmed landscape can accommodate. The animal will keep building regardless of the arguments made about it. The question is whether the people who share its rivers can be persuaded that the ponds, the flooded willows and the slow, patient reshaping of the land are a price worth paying for the water it stores and the life it brings back.",
    ],
    questions: [
      {
        id: "r1-q1",
        type: "true-false-notgiven",
        prompt:
          "By 1900, the European beaver population across the continent had fallen below 1,200.",
        answers: ["True"],
      },
      {
        id: "r1-q2",
        type: "true-false-notgiven",
        prompt: "Beavers were hunted partly for a substance used in medicine.",
        answers: ["True"],
      },
      {
        id: "r1-q3",
        type: "true-false-notgiven",
        prompt:
          "The reintroduction schemes of the 1920s were coordinated by a single European authority.",
        answers: ["False"],
      },
      {
        id: "r1-q4",
        type: "true-false-notgiven",
        prompt: "Beavers in Britain are more popular with the public than in any other country.",
        answers: ["Not Given"],
      },
      {
        id: "r1-q5",
        type: "true-false-notgiven",
        prompt: "Engineered flood defences are becoming cheaper over time.",
        answers: ["False"],
      },
      {
        id: "r1-q6",
        type: "multiple-choice",
        prompt: "Why does the writer describe the beaver as a 'keystone species'?",
        options: [
          "Because it is the largest rodent found in Europe.",
          "Because its activity changes the habitat in ways that help many other species.",
          "Because it was the first animal to be reintroduced to Britain.",
          "Because it is protected by law across the continent.",
        ],
        answers: ["Because its activity changes the habitat in ways that help many other species."],
      },
      {
        id: "r1-q7",
        type: "multiple-choice",
        prompt: "According to the passage, how did beavers return to some British rivers?",
        options: [
          "Through a national reintroduction plan.",
          "By migrating from mainland Europe.",
          "By escaping from private collections.",
          "By being released by farmers.",
        ],
        answers: ["By escaping from private collections."],
      },
      {
        id: "r1-q8",
        type: "multiple-choice",
        prompt: "Why have some water authorities changed their attitude to beavers?",
        options: [
          "Beavers reduce flood peaks downstream at no cost.",
          "Beavers are now a protected species.",
          "Beavers attract tourists to rivers.",
          "Beavers remove sediment from drinking water.",
        ],
        answers: ["Beavers reduce flood peaks downstream at no cost."],
      },
      {
        id: "r1-q9",
        type: "short-answer",
        prompt:
          "Complete the sentence: The wetlands beavers create act as natural ________, holding back water during heavy rain.",
        answers: ["sponges", "sponge"],
        wordLimit: "One word",
      },
      {
        id: "r1-q10",
        type: "short-answer",
        prompt:
          "Complete the sentence: By felling trees and ________ streams, a beaver family can create a chain of ponds.",
        answers: ["damming"],
        wordLimit: "One word",
      },
      {
        id: "r1-q11",
        type: "short-answer",
        prompt:
          "Complete the sentence: The costs of the beaver's activity fall ________ on the people who live nearby.",
        answers: ["unevenly"],
        wordLimit: "One word",
      },
      {
        id: "r1-q12",
        type: "true-false-notgiven",
        prompt:
          "Compensation schemes have helped reduce local opposition where reintroduction was well managed.",
        answers: ["True"],
      },
      {
        id: "r1-q13",
        type: "multiple-choice",
        prompt: "What does the writer suggest the debate is ultimately about?",
        options: [
          "How to eradicate beavers from farmland.",
          "How much wildness a farmed landscape can accept.",
          "Whether beavers should be hunted again.",
          "How to make flood defences cheaper.",
        ],
        answers: ["How much wildness a farmed landscape can accept."],
      },
    ],
  },
  {
    id: "the-science-of-the-siesta",
    title: "The science of the siesta",
    level: "Bands 6–7.5",
    passage: [
      "The idea that humans are built for a single, unbroken block of night-time sleep is surprisingly modern. Historical records suggest that before artificial lighting was widespread, many people slept in two phases, with an hour or so of quiet wakefulness in the middle of the night. The afternoon dip in alertness that many of us feel after lunch is not, as is often assumed, simply the result of a heavy meal. It appears to be part of the body's natural rhythm, a scheduled lull that occurs whether or not we have eaten.",
      "This afternoon slump has a physiological basis. Body temperature, which tracks our cycles of alertness, falls slightly in the early afternoon before rising again. In cultures where a midday rest, or siesta, is traditional, daily life has long been organised around this dip. Shops close, streets empty, and activity resumes in the cooler, more productive hours of the late afternoon and evening. Far from being a sign of laziness, the siesta may represent a sensible accommodation to how human alertness actually works.",
      "Laboratory studies of short daytime sleep have produced striking results. A nap of around twenty minutes can improve alertness, mood and reaction time for several hours, without leaving the grogginess that follows a longer sleep. This grogginess, known as sleep inertia, occurs when a sleeper is woken from the deeper stages of sleep. Keeping the nap short avoids these stages, which is why the most effective naps are also among the briefest.",
      "The benefits are not limited to feeling more awake. Several studies have linked regular short naps to better performance on tasks requiring memory and learning. The sleeping brain appears to consolidate recently acquired information, strengthening the connections that store it. A student who naps after studying may, in effect, be giving the day's learning time to settle. Some companies, persuaded by such findings, have installed rest areas and now quietly encourage staff to sleep during the working day.",
      "Yet the practice remains controversial in many workplaces, where sleeping on the job carries a stubborn stigma. There are practical objections too. A nap taken too late in the day can make it harder to fall asleep at night, and for people who already sleep poorly, daytime sleep may make matters worse rather than better. The evidence, in other words, favours the nap for most people most of the time — but not as a universal remedy.",
      "What the research does suggest is that the rigid boundary many societies draw between waking and sleeping is more a cultural habit than a biological necessity. The body, left to its own devices, seems inclined to rest more than once a day. Whether modern working life can ever be reorganised to suit that inclination is, for now, an open question.",
    ],
    questions: [
      {
        id: "r2-q1",
        type: "true-false-notgiven",
        prompt:
          "The belief that humans should sleep in one unbroken block at night is a relatively recent one.",
        answers: ["True"],
      },
      {
        id: "r2-q2",
        type: "true-false-notgiven",
        prompt: "The afternoon dip in alertness is caused only by eating a large lunch.",
        answers: ["False"],
      },
      {
        id: "r2-q3",
        type: "true-false-notgiven",
        prompt: "Body temperature rises steadily throughout the afternoon.",
        answers: ["False"],
      },
      {
        id: "r2-q4",
        type: "true-false-notgiven",
        prompt: "Siestas are more common in hot countries than in cold ones.",
        answers: ["Not Given"],
      },
      {
        id: "r2-q5",
        type: "multiple-choice",
        prompt: "Why are the most effective naps described as short?",
        options: [
          "Short naps are easier to fit into a working day.",
          "Short naps avoid the deep sleep stages that cause grogginess.",
          "Short naps use less energy than long ones.",
          "Short naps are recommended by most companies.",
        ],
        answers: ["Short naps avoid the deep sleep stages that cause grogginess."],
      },
      {
        id: "r2-q6",
        type: "short-answer",
        prompt:
          "Complete the sentence: The grogginess that follows a longer sleep is known as sleep ________.",
        answers: ["inertia"],
        wordLimit: "One word",
      },
      {
        id: "r2-q7",
        type: "multiple-choice",
        prompt: "How might a nap help a student who has just studied?",
        options: [
          "It replaces the need for further study.",
          "It gives the brain time to consolidate what was learned.",
          "It improves body temperature control.",
          "It removes the need for night-time sleep.",
        ],
        answers: ["It gives the brain time to consolidate what was learned."],
      },
      {
        id: "r2-q8",
        type: "true-false-notgiven",
        prompt: "Some companies have created spaces where staff can sleep during the working day.",
        answers: ["True"],
      },
      {
        id: "r2-q9",
        type: "true-false-notgiven",
        prompt: "Napping is beneficial for absolutely everyone in every situation.",
        answers: ["False"],
      },
      {
        id: "r2-q10",
        type: "short-answer",
        prompt:
          "Complete the sentence: A nap of around ________ minutes can improve alertness for several hours.",
        answers: ["twenty", "20"],
        wordLimit: "One word or a number",
      },
      {
        id: "r2-q11",
        type: "multiple-choice",
        prompt: "What is the writer's overall conclusion about napping?",
        options: [
          "It is a universal remedy for tiredness.",
          "It is harmful for most people.",
          "It suits most people most of the time, but is not for everyone.",
          "It should replace night-time sleep entirely.",
        ],
        answers: ["It suits most people most of the time, but is not for everyone."],
      },
      {
        id: "r2-q12",
        type: "true-false-notgiven",
        prompt:
          "The writer says the divide between waking and sleeping is more cultural than biological.",
        answers: ["True"],
      },
    ],
  },
];

/**
 * Academic Reading raw→band conversion (out of 40), from widely published IELTS
 * guidance. Ordered high→low; `rawToBand` scales shorter practice papers to /40
 * before lookup.
 *
 * @see https://www.ielts.org/for-test-takers/how-ielts-is-scored
 */
export const READING_BAND_TABLE: BandTable = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [33, 7.5],
  [30, 7],
  [27, 6.5],
  [23, 6],
  [19, 5.5],
  [15, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [3, 2],
  [2, 1.5],
  [1, 1],
];

export function getReadingTest(id: string): ReadingTest | undefined {
  return READING_TESTS.find((test) => test.id === id);
}

/** Deterministic pick from a seed (e.g. a session id); no seed → the first test. */
export function pickReadingTest(seed?: string): ReadingTest {
  if (!seed) return READING_TESTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return READING_TESTS[Math.abs(hash) % READING_TESTS.length];
}
