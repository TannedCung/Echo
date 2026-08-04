import type { SpeakingCriterion } from "./band-descriptors";
import type { WritingCriterion, WritingTaskType } from "./writing-descriptors";

/**
 * Detailed level-by-level IELTS Band Descriptors (Bands 4–9) for all criteria,
 * extracted directly from public official IELTS assessment grids.
 * Used for AI examiner grounding, dataset calibration, and diagnostic feedback.
 */

export interface DescriptorLevel {
  band: number;
  summary: string;
  keyFeatures: string[];
}

export type CriterionRubric = Record<number, DescriptorLevel>;

/** Detailed Writing Band Descriptors (Bands 4 to 9) */
export const WRITING_DETAILED_RUBRICS: Record<
  WritingCriterion,
  (task: WritingTaskType) => CriterionRubric
> = {
  taskResponse: (task: WritingTaskType) => ({
    9: {
      band: 9,
      summary:
        task === "task1"
          ? "Fully satisfies all requirements of the prompt."
          : "Fully addresses all parts of the prompt with a clear, sustained position.",
      keyFeatures: [
        task === "task1"
          ? "Presents a fully developed response to the task with a comprehensive overview."
          : "Presents a fully developed position in answer to the question with well-supported ideas.",
        "Musters relevant, fully extended and well-supported ideas throughout.",
      ],
    },
    8: {
      band: 8,
      summary:
        task === "task1"
          ? "Covers all requirements of the prompt sufficiently."
          : "Sufficiently addresses all parts of the task with a well-developed response.",
      keyFeatures: [
        task === "task1"
          ? "Presents a clear overview of main trends, differences or stages."
          : "Presents a well-developed response to the question with relevant, extended ideas.",
        "Key features are clearly presented and highlighted.",
      ],
    },
    7: {
      band: 7,
      summary:
        task === "task1"
          ? "Covers the requirements of the task with a clear overview."
          : "Addresses all parts of the task with a clear position throughout.",
      keyFeatures: [
        task === "task1"
          ? "Presents a clear overview of main trends or key stages."
          : "Presents a clear position throughout the response.",
        "Presents and extends main ideas, but may over-generalise or lack focus in places.",
      ],
    },
    6: {
      band: 6,
      summary:
        task === "task1"
          ? "Focuses on the task with an adequate overview."
          : "Addresses all parts of the task, though some parts may be more fully covered than others.",
      keyFeatures: [
        task === "task1"
          ? "Presents an overview with information appropriately selected."
          : "Presents a relevant position, though conclusions may be unclear or repetitive.",
        "Presents relevant key features but details may be irrelevant, inappropriate or inaccurate.",
      ],
    },
    5: {
      band: 5,
      summary:
        task === "task1"
          ? "Generally addresses the task; overview may be missing or unclear."
          : "Expresses a position but development is not always clear; limited supporting details.",
      keyFeatures: [
        task === "task1"
          ? "Recounts detail mechanically with no clear overview."
          : "Addresses the task only partially; position may be unclear.",
        "Main points may be inadequately covered or tend to focus on details.",
      ],
    },
    4: {
      band: 4,
      summary: "Attempts to address the task but response is minimal or off-topic.",
      keyFeatures: [
        "Fails to present a clear position or key features.",
        "Ideas may be limited, repetitive, or irrelevant.",
      ],
    },
  }),

  coherenceCohesion: () => ({
    9: {
      band: 9,
      summary: "Uses cohesion in such a way that it attracts no attention.",
      keyFeatures: [
        "Skillfully manages paragraphing.",
        "Cohesion is seamless and unobtrusive throughout.",
      ],
    },
    8: {
      band: 8,
      summary: "Sequences information and ideas logically with clear progression.",
      keyFeatures: [
        "Manages paragraphing suffiently and appropriately.",
        "Uses a range of cohesive devices appropriately with minimal over- or under-use.",
      ],
    },
    7: {
      band: 7,
      summary: "Logically organises information and ideas with clear overall progression.",
      keyFeatures: [
        "Uses a range of cohesive devices appropriately although there may be some under- or over-use.",
        "Presents a clear central topic within each paragraph.",
      ],
    },
    6: {
      band: 6,
      summary: "Organises information and ideas coherently with clear overall progression.",
      keyFeatures: [
        "Uses cohesive devices effectively, but cohesion within or between sentences may be faulty or mechanical.",
        "Uses paragraphing, but not always logically.",
      ],
    },
    5: {
      band: 5,
      summary:
        "Makes information and ideas understandable, but organisation is not always logical.",
      keyFeatures: [
        "Makes inadequate or inaccurate use of cohesive devices.",
        "May not write in paragraphs or paragraphing may be inadequate.",
      ],
    },
    4: {
      band: 4,
      summary: "Information and ideas are presented but not organised logically.",
      keyFeatures: [
        "Cohesive devices are rare, repetitive, or faulty.",
        "Lack of logical progression.",
      ],
    },
  }),

  lexicalResource: () => ({
    9: {
      band: 9,
      summary: "Uses a wide range of vocabulary with natural and sophisticated control.",
      keyFeatures: [
        "Rare minor errors only occur as slips.",
        "Very natural and sophisticated control of lexical features.",
      ],
    },
    8: {
      band: 8,
      summary: "Uses a wide range of vocabulary fluently and flexibly to convey precise meanings.",
      keyFeatures: [
        "Skillfully uses uncommon lexical items with occasional inaccuracies in word choice or collocation.",
        "Occasional spelling or word formation errors occur as slips.",
      ],
    },
    7: {
      band: 7,
      summary: "Uses a sufficient range of vocabulary to allow some flexibility and precision.",
      keyFeatures: [
        "Uses less common lexical items with some awareness of style and collocation.",
        "May produce occasional errors in word choice, spelling or word formation.",
      ],
    },
    6: {
      band: 6,
      summary: "Uses an adequate range of vocabulary for the task.",
      keyFeatures: [
        "Attempts to use less common vocabulary but with some inaccuracy.",
        "Makes some errors in spelling and word formation, but they do not impede communication.",
      ],
    },
    5: {
      band: 5,
      summary: "Uses a limited range of vocabulary, but minimally adequate for the task.",
      keyFeatures: [
        "Noticeable errors in spelling or word formation that cause difficulty for the reader.",
        "Limited flexibility and frequent repetition.",
      ],
    },
    4: {
      band: 4,
      summary: "Uses only basic vocabulary which may be repetitive or inappropriate.",
      keyFeatures: [
        "Frequent spelling and word formation errors dominate.",
        "Extremely limited vocabulary range.",
      ],
    },
  }),

  grammaticalRange: () => ({
    9: {
      band: 9,
      summary: "Uses a wide range of structures with full flexibility and accuracy.",
      keyFeatures: [
        "Rare minor errors occur only as slips.",
        "Complete structural variety and accuracy throughout.",
      ],
    },
    8: {
      band: 8,
      summary: "Uses a wide range of structures with a majority of error-free sentences.",
      keyFeatures: [
        "Makes only occasional errors or inappropriacies.",
        "Good control of complex sentence structures.",
      ],
    },
    7: {
      band: 7,
      summary: "Uses a variety of complex structures with frequent error-free sentences.",
      keyFeatures: [
        "Has good control of grammar and punctuation but may make a few errors.",
        "Frequent error-free structures.",
      ],
    },
    6: {
      band: 6,
      summary: "Uses a mix of simple and complex sentence forms.",
      keyFeatures: [
        "Makes some errors in grammar and punctuation but they rarely reduce communication.",
        "Good proportion of clear sentences.",
      ],
    },
    5: {
      band: 5,
      summary: "Uses only a limited range of structures with frequent grammatical errors.",
      keyFeatures: [
        "Attempts complex sentences but these tend to be less accurate than simple sentences.",
        "Grammar errors may cause frequent comprehension difficulty.",
      ],
    },
    4: {
      band: 4,
      summary: "Uses a very limited range of structures with predominant errors.",
      keyFeatures: ["Punctuation is faulty.", "Grammatical errors dominate and obscure meaning."],
    },
  }),
};

/** Detailed Speaking Band Descriptors (Bands 4 to 9) */
export const SPEAKING_DETAILED_RUBRICS: Record<SpeakingCriterion, CriterionRubric> = {
  fluencyCoherence: {
    9: {
      band: 9,
      summary: "Speaks fluently with only rare repetition or self-correction.",
      keyFeatures: [
        "Hesitation is content-related rather than searching for language.",
        "Develops topics fully and coherently with natural discourse markers.",
      ],
    },
    8: {
      band: 8,
      summary: "Speaks fluently with only occasional repetition or self-correction.",
      keyFeatures: [
        "Hesitation is usually for ideas rather than vocabulary or grammar.",
        "Develops topics coherently and appropriately.",
      ],
    },
    7: {
      band: 7,
      summary: "Speaks at length without noticeable effort or loss of coherence.",
      keyFeatures: [
        "May demonstrate language-related hesitation at times.",
        "Uses a range of connectives and discourse markers with some flexibility.",
      ],
    },
    6: {
      band: 6,
      summary: "Is willing to speak at length, though may lose coherence at times.",
      keyFeatures: [
        "Uses a range of connectives but not always appropriately.",
        "Has some repetition, self-correction or slow speech.",
      ],
    },
    5: {
      band: 5,
      summary:
        "Usually maintains flow of speech but uses repetition or self-correction to keep going.",
      keyFeatures: [
        "Slow speech with frequent hesitation.",
        "Overuses certain simple connectives.",
      ],
    },
    4: {
      band: 4,
      summary: "Cannot respond without noticeable pauses and speaks slowly.",
      keyFeatures: [
        "Frequent self-correction and breakdown in coherence.",
        "Links sentences with basic conjunctions.",
      ],
    },
  },

  lexicalResource: {
    9: {
      band: 9,
      summary: "Uses vocabulary flexibly and precisely for all topics.",
      keyFeatures: [
        "Uses idiomatic language naturally and accurately.",
        "Paraphrases seamlessly when required.",
      ],
    },
    8: {
      band: 8,
      summary: "Uses a wide vocabulary resource readily and flexibly to convey precise meaning.",
      keyFeatures: [
        "Uses less common and idiomatic vocabulary skillfully.",
        "Paraphrases effectively as required.",
      ],
    },
    7: {
      band: 7,
      summary: "Uses vocabulary resource flexibly to discuss a variety of topics.",
      keyFeatures: [
        "Uses some less common and idiomatic vocabulary with awareness of collocation.",
        "Paraphrases successfully.",
      ],
    },
    6: {
      band: 6,
      summary: "Has a wide enough vocabulary to discuss topics at length.",
      keyFeatures: [
        "Generally succeeds in paraphrasing.",
        "Conveys meaning clearly despite inaccuracies.",
      ],
    },
    5: {
      band: 5,
      summary:
        "Manages to talk about familiar and unfamiliar topics, but with limited flexibility.",
      keyFeatures: [
        "Attempts paraphrase but with limited success.",
        "Frequent word choice errors.",
      ],
    },
    4: {
      band: 4,
      summary: "Vocabulary is limited to basic needs.",
      keyFeatures: ["Rarely attempts paraphrase.", "Frequent inappropriate word choices."],
    },
  },

  grammaticalRange: {
    9: {
      band: 9,
      summary: "Uses a full range of structures naturally and appropriately.",
      keyFeatures: [
        "Consistently accurate with only minor slips.",
        "Full flexibility across all sentence structures.",
      ],
    },
    8: {
      band: 8,
      summary: "Uses a wide range of structures flexibly with high accuracy.",
      keyFeatures: [
        "Majority of sentences are error-free.",
        "Occasional non-systematic errors or inappropriacies.",
      ],
    },
    7: {
      band: 7,
      summary: "Uses a range of complex structures with some flexibility.",
      keyFeatures: [
        "Frequently produces error-free sentences.",
        "Good grammatical control with minor mistakes.",
      ],
    },
    6: {
      band: 6,
      summary: "Uses a mix of simple and complex structures.",
      keyFeatures: [
        "Makes frequent mistakes with complex structures, though these rarely cause misunderstanding.",
        "Good basic sentence control.",
      ],
    },
    5: {
      band: 5,
      summary: "Produces basic sentence forms with reasonable accuracy.",
      keyFeatures: [
        "Uses a limited range of complex structures that tend to contain errors.",
        "Errors may cause misunderstanding.",
      ],
    },
    4: {
      band: 4,
      summary: "Produces simple sentence forms with frequent errors.",
      keyFeatures: ["Subordinate clauses are rare or missing.", "Grammatical errors dominate."],
    },
  },

  pronunciation: {
    9: {
      band: 9,
      summary: "Uses a full range of pronunciation features with precision and subtlety.",
      keyFeatures: [
        "Sustained control of stress, rhythm, and intonation.",
        "Is effortless to understand.",
      ],
    },
    8: {
      band: 8,
      summary: "Uses a wide range of pronunciation features.",
      keyFeatures: [
        "Sustains flexible use of features throughout with only occasional lapses.",
        "Is easy to understand throughout.",
      ],
    },
    7: {
      band: 7,
      summary: "Shows all the positive features of Band 6 and some of Band 8.",
      keyFeatures: [
        "Uses intonation and stress appropriately.",
        "Is generally clear and easy to understand.",
      ],
    },
    6: {
      band: 6,
      summary: "Uses a range of pronunciation features with mixed control.",
      keyFeatures: [
        "Can generally be understood throughout.",
        "Mispronunciations of individual words occur.",
      ],
    },
    5: {
      band: 5,
      summary: "Shows all the positive features of Band 4 and some of Band 6.",
      keyFeatures: [
        "Mispronunciations frequently cause strain for the listener.",
        "Limited control of stress and intonation.",
      ],
    },
    4: {
      band: 4,
      summary: "Uses limited pronunciation features with frequent mispronunciations.",
      keyFeatures: ["Causes frequent listener strain.", "Lacks control of stress and rhythm."],
    },
  },
};
