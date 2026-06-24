/**
 * Official IELTS Speaking assessment criteria, encoded as data so the scorer
 * agent, the UI, and tests share one source of truth. Summaries are distilled
 * from the public IELTS Speaking band descriptors (bands 0–9).
 *
 * @see https://www.ielts.org/for-test-takers/how-ielts-is-scored
 */

export const SPEAKING_CRITERIA = [
  "fluencyCoherence",
  "lexicalResource",
  "grammaticalRange",
  "pronunciation",
] as const;

export type SpeakingCriterion = (typeof SPEAKING_CRITERIA)[number];

export interface CriterionInfo {
  key: SpeakingCriterion;
  label: string;
  short: string;
  description: string;
}

export const CRITERIA_INFO: Record<SpeakingCriterion, CriterionInfo> = {
  fluencyCoherence: {
    key: "fluencyCoherence",
    label: "Fluency & Coherence",
    short: "Fluency",
    description:
      "Ability to speak at length without noticeable effort, with logical sequencing, clear connectives, and minimal hesitation or self-correction.",
  },
  lexicalResource: {
    key: "lexicalResource",
    label: "Lexical Resource",
    short: "Vocabulary",
    description:
      "Range and precision of vocabulary, including idiomatic and topic-specific language, paraphrase, and collocation.",
  },
  grammaticalRange: {
    key: "grammaticalRange",
    label: "Grammatical Range & Accuracy",
    short: "Grammar",
    description:
      "Range of sentence structures and the accuracy and appropriacy with which they are used.",
  },
  pronunciation: {
    key: "pronunciation",
    label: "Pronunciation",
    short: "Pronunciation",
    description:
      "Use of stress, rhythm, intonation, and individual sounds in a way that is intelligible and natural.",
  },
};

/** Short anchors for key bands, used to ground the scorer and explain results. */
export const BAND_ANCHORS: Record<number, string> = {
  9: "Expert user — fully operational command, fluent, accurate, and natural.",
  8: "Very good user — fluent with only occasional unsystematic inaccuracies.",
  7: "Good user — speaks at length with some flexibility; occasional lapses.",
  6: "Competent user — generally effective despite some inaccuracies and hesitation.",
  5: "Modest user — partial command; copes with overall meaning in most situations.",
  4: "Limited user — frequent breakdowns; basic competence in familiar situations.",
};

/** IELTS Speaking bands are reported in half-band steps from 0 to 9. */
export const BAND_STEPS = [
  0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
] as const;

/** Overall band = average of the four criteria, rounded to the nearest half. */
export function roundToBand(value: number): number {
  return Math.round(value * 2) / 2;
}

export function overallBand(scores: Record<SpeakingCriterion, number>): number {
  const sum = SPEAKING_CRITERIA.reduce((acc, key) => acc + scores[key], 0);
  return roundToBand(sum / SPEAKING_CRITERIA.length);
}
