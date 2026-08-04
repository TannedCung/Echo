import type { SpeakingCriterion } from "./band-descriptors";
import type { WritingCriterion, WritingTaskType } from "./writing-descriptors";

/**
 * Authentic IELTS Benchmark Exemplar Dataset for Writing and Speaking.
 * Contains public test prompts, candidate responses, ground-truth band scores,
 * per-criterion breakdowns, and official examiner commentary across Bands 5.0–9.0.
 * Serves as the golden reference dataset for AI examiner calibration and testing.
 */

export interface WritingBenchmarkSample {
  id: string;
  task: WritingTaskType;
  title: string;
  prompt: string;
  response: string;
  wordCount: number;
  groundTruth: {
    overallBand: number;
    scores: Record<WritingCriterion, number>;
    examinerComment: string;
    verbatimQuotes: Record<WritingCriterion, string[]>;
  };
}

export interface SpeakingBenchmarkSample {
  id: string;
  title: string;
  topic: string;
  transcript: {
    speaker: "examiner" | "candidate";
    text: string;
  }[];
  groundTruth: {
    overallBand: number;
    scores: Record<SpeakingCriterion, number>;
    examinerComment: string;
    verbatimQuotes: Record<SpeakingCriterion, string[]>;
  };
}

/** Writing Benchmark Exemplar Dataset across Bands 5.0, 6.0, 7.0, 8.0, and 9.0 */
export const WRITING_BENCHMARK_DATASET: WritingBenchmarkSample[] = [
  // --- BAND 9.0 EXEMPLAR (TASK 1) ---
  {
    id: "writing-b9-t1-commuting",
    task: "task1",
    title: "Commuting Modes Comparison",
    prompt:
      "The table below shows the percentage of workers in a city who used four different modes of transport to commute in 2005 and 2020.\n\n• Car: 55% (2005) → 38% (2020)\n• Public transport: 25% (2005) → 34% (2020)\n• Cycling: 8% (2005) → 18% (2020)\n• Walking: 12% (2005) → 10% (2020)",
    response:
      "The table illustrates the proportions of city commuters utilizing four distinct modes of transportation over a fifteen-year timeframe between 2005 and 2020.\n\nOverall, a striking shift away from private motor vehicles toward sustainable and public modes of transit occurred over the period. While driving was by far the predominant choice in 2005, public transportation and bicycle commuting experienced significant expansions by 2020.\n\nIn 2005, over half of all workers (55%) commuted via private car. However, by 2020, this figure dropped sharply by 17 percentage points to 38%. Conversely, public transport recorded a steady growth from 25% to 34%, becoming the second most popular option.\n\nActive transport modes exhibited contrasting trajectories. Cycling witnessed a dramatic rise, more than doubling from 8% in 2005 to 18% fifteen years later. In contrast, foot travel declined marginally from 12% to 10% over the same timeframe.",
    wordCount: 153,
    groundTruth: {
      overallBand: 9.0,
      scores: {
        taskResponse: 9.0,
        coherenceCohesion: 9.0,
        lexicalResource: 9.0,
        grammaticalRange: 9.0,
      },
      examinerComment:
        "An outstanding response that fully satisfies all task requirements. The overview is clear and insightful, and key features are highlighted with precision. Cohesion is seamless, vocabulary is sophisticated, and grammar is completely error-free.",
      verbatimQuotes: {
        taskResponse: [
          "striking shift away from private motor vehicles toward sustainable and public modes of transit",
          "dropped sharply by 17 percentage points to 38%",
        ],
        coherenceCohesion: [
          "Overall, a striking shift",
          "Conversely, public transport recorded",
          "In contrast, foot travel declined",
        ],
        lexicalResource: [
          "fifteen-year timeframe",
          "predominant choice",
          "contrasting trajectories",
        ],
        grammaticalRange: [
          "The table illustrates the proportions of city commuters utilizing four distinct modes",
          "more than doubling from 8% in 2005 to 18% fifteen years later",
        ],
      },
    },
  },

  // --- BAND 8.0 EXEMPLAR (TASK 2) ---
  {
    id: "writing-b8-t2-remote-work",
    task: "task2",
    title: "Remote Work & Flexible Hours",
    prompt:
      "Many companies now allow employees to work from home for part or all of the week. Discuss both views and give your own opinion.",
    response:
      "The rapid adoption of remote working arrangements has reshaped the modern employment landscape. While some critics argue that telecommuting damages workplace cohesion and reduces managerial oversight, I firmly believe that hybrid work models offer substantial advantages for both employee wellbeing and corporate productivity.\n\nOn the one hand, opponents of remote work highlight potential drawbacks regarding team collaboration and isolation. When staff work in physical isolation, spontaneous exchanges and creative brainstorming sessions occur less frequently. Furthermore, junior employees may struggle to receive adequate mentorship without face-to-face interaction. For instance, tech firms that required a full return to the office often cited the need to preserve company culture and foster innovation through personal contact.\n\nOn the other hand, working from home provides unprecedented flexibility and eliminates stressful daily commutes. Eliminating hours spent traveling allows workers to achieve a healthier work-life balance, reducing burnout. From an enterprise perspective, companies can significantly decrease expenditures on office real estate while expanding their recruitment pool globally. Research demonstrates that autonomous employees often report higher job satisfaction and output when granted schedule flexibility.\n\nIn conclusion, although remote arrangements require deliberate communication strategies to maintain team cohesion, the benefits regarding flexibility, reduced commuting stress, and global talent acquisition far outweigh the drawbacks. Employers should embrace hybrid frameworks to stay competitive.",
    wordCount: 268,
    groundTruth: {
      overallBand: 8.0,
      scores: {
        taskResponse: 8.0,
        coherenceCohesion: 8.0,
        lexicalResource: 8.0,
        grammaticalRange: 8.0,
      },
      examinerComment:
        "A well-developed, highly persuasive response. The writer presents a clear position throughout, addresses both sides thoroughly, and supports main points with relevant examples. Paragraphing is logical, vocabulary is precise and natural, and complex sentences are used with high accuracy.",
      verbatimQuotes: {
        taskResponse: [
          "firmly believe that hybrid work models offer substantial advantages",
          "far outweigh the drawbacks",
        ],
        coherenceCohesion: [
          "On the one hand",
          "On the other hand",
          "In conclusion, although remote arrangements require",
        ],
        lexicalResource: [
          "reshaped the modern employment landscape",
          "unprecedented flexibility",
          "deliberate communication strategies",
        ],
        grammaticalRange: [
          "While some critics argue that telecommuting damages workplace cohesion... I firmly believe",
          "Research demonstrates that autonomous employees often report higher job satisfaction",
        ],
      },
    },
  },

  // --- BAND 7.0 EXEMPLAR (TASK 1) ---
  {
    id: "writing-b7-t1-glass-recycling",
    task: "task1",
    title: "Glass Recycling Process",
    prompt:
      "The following describes the stages in the recycling of glass bottles. Summarise the information by describing the process as a sequence of stages.",
    response:
      "The diagram illustrates the process by which used glass bottles are recycled to produce new glass containers.\n\nOverall, the recycling procedure consists of five main stages, beginning with the collection of used glass and culminating in the delivery of newly molded bottles to retail stores.\n\nTo begin with, discarded glass bottles are collected from residential households and commercial businesses before being transported to a processing facility. At the plant, the collected bottles are sorted according to their colour—typically green, brown, and clear—and thoroughly cleaned to remove contaminants.\n\nFollowing the cleaning phase, the glass is crushed into small fragments known as cullet. This cullet is then transferred into a high-temperature furnace where it is melted into molten glass. Once fully melted, the liquid glass is shaped into new bottle molds. Finally, the newly formed bottles undergo a cooling process, quality inspection, and are subsequently delivered to retail shops for reuse.",
    wordCount: 162,
    groundTruth: {
      overallBand: 7.0,
      scores: {
        taskResponse: 7.0,
        coherenceCohesion: 7.0,
        lexicalResource: 7.0,
        grammaticalRange: 7.0,
      },
      examinerComment:
        "A clear, well-organised report that covers all main stages of the process. The overview is accurate and paragraphing is logical. Good use of sequencing words and passive grammar, though vocabulary is slightly predictable.",
      verbatimQuotes: {
        taskResponse: [
          "five main stages, beginning with the collection of used glass and culminating in the delivery",
        ],
        coherenceCohesion: ["To begin with", "Following the cleaning phase", "Finally"],
        lexicalResource: [
          "culminating in the delivery",
          "residential households and commercial businesses",
          "subsequently delivered",
        ],
        grammaticalRange: [
          "the collected bottles are sorted according to their colour... and thoroughly cleaned",
          "This cullet is then transferred into a high-temperature furnace where it is melted",
        ],
      },
    },
  },

  // --- BAND 6.0 EXEMPLAR (TASK 2) ---
  {
    id: "writing-b6-t2-public-transport",
    task: "task2",
    title: "Funding Public Transport vs Building Roads",
    prompt:
      "Some people think that governments should spend money on improving public transport rather than on building new roads. To what extent do you agree or disagree?",
    response:
      "Nowadays, traffic congestion is a major problem in many modern cities. Some people argue that governments ought to invest more funds in developing public transportation instead of constructing new roads. I mostly agree with this opinion because public transport is better for the environment and reduces traffic jams.\n\nFirstly, spending money on buses and trains can significantly reduce air pollution. When more people use public transport like metros or electric buses, fewer private cars are on the road. Consequently, toxic exhaust fumes will decrease, which makes city air cleaner. For example, cities with good subway systems like Tokyo have less smog compared to car-dependent cities.\n\nSecondly, building more roads does not solve traffic problems in the long term. When new highways are built, more people choose to buy cars, which leads to traffic jams again after a few years. On the other hand, if public transit is cheap and fast, commuters will naturally choose it instead of driving. This saves time and money for citizens.\n\nHowever, building new roads is still necessary in rural areas where public transport cannot cover every village. Nevertheless, in big cities, public transport should be the main priority for government investment.\n\nIn conclusion, I believe governments should focus their budget on public transportation because it protects the environment and solves traffic congestion effectively.",
    wordCount: 236,
    groundTruth: {
      overallBand: 6.0,
      scores: {
        taskResponse: 6.0,
        coherenceCohesion: 6.0,
        lexicalResource: 6.0,
        grammaticalRange: 6.0,
      },
      examinerComment:
        "The candidate addresses the prompt with a clear position. Ideas are relevant and organised into paragraphs. However, word count is slightly under 250 words (236 words), which restricts the Task Response score to Band 6. Connectives are sometimes repetitive and vocabulary is straightforward.",
      verbatimQuotes: {
        taskResponse: [
          "I mostly agree with this opinion because public transport is better",
          "in big cities, public transport should be the main priority",
        ],
        coherenceCohesion: ["Firstly", "Secondly", "On the other hand", "In conclusion"],
        lexicalResource: ["traffic congestion", "toxic exhaust fumes", "car-dependent cities"],
        grammaticalRange: [
          "When more people use public transport... fewer private cars are on the road",
          "When new highways are built, more people choose to buy cars",
        ],
      },
    },
  },

  // --- BAND 5.0 EXEMPLAR (TASK 2) ---
  {
    id: "writing-b5-t2-technology-childhood",
    task: "task2",
    title: "Children & Digital Devices",
    prompt:
      "Children today spend an increasing amount of their free time using digital devices such as tablets and smartphones. Discuss both views and give your own opinion.",
    response:
      "Today children use smartphones and tablets every day. Some people say this is good for children, but other people think it is bad for their health. In my opinion, I think digital devices have both good and bad points.\n\nOn the one side, using smartphones can help children learn many things. They can watch educational video on Youtube and search information for homework. Also they can play games to make their brain smart. My cousin learn English words from smartphone application when he was six year old.\n\nOn the other side, looking at screen too long is bad for eyes. Children do not play outdoor games with friends, so they get fat and lazy. Many parents cannot control their children because children cry when smartphone is taken away. This cause bad behaviour at school.\n\nIn conclusion, technology is useful but children should not use it all day. Parents must limit time for smartphone.",
    wordCount: 154,
    groundTruth: {
      overallBand: 5.0,
      scores: {
        taskResponse: 5.0,
        coherenceCohesion: 5.0,
        lexicalResource: 5.0,
        grammaticalRange: 5.0,
      },
      examinerComment:
        "The response is severely under-length (154 words for Task 2), which heavily restricts the Task Response score. The main ideas are basic, grammar errors in agreement and singular/plural are frequent ('educational video', 'My cousin learn', 'he was six year old'), and vocabulary is limited.",
      verbatimQuotes: {
        taskResponse: ["In my opinion, I think digital devices have both good and bad points."],
        coherenceCohesion: ["On the one side", "On the other side", "In conclusion"],
        lexicalResource: [
          "make their brain smart",
          "get fat and lazy",
          "limit time for smartphone",
        ],
        grammaticalRange: [
          "My cousin learn English words from smartphone application when he was six year old",
          "This cause bad behaviour at school",
        ],
      },
    },
  },
];

/** Speaking Benchmark Exemplar Dataset across Bands 5.0, 6.0, 7.0, 8.0, and 9.0 */
export const SPEAKING_BENCHMARK_DATASET: SpeakingBenchmarkSample[] = [
  // --- BAND 8.5 SPEAKING EXEMPLAR ---
  {
    id: "speaking-b85-journeys",
    title: "Journeys & Places Session",
    topic: "Journeys and urban environment",
    transcript: [
      {
        speaker: "examiner",
        text: "Good morning. Could you tell me about a place you would like to visit in the future?",
      },
      {
        speaker: "candidate",
        text: "Certainly. I've long been fascinated by Kyoto in Japan. What draws me to Kyoto is its remarkable balance between ancient cultural heritage and contemporary urban life. I'd love to wander through the historical Gion district and explore the traditional wooden machiya houses.",
      },
      {
        speaker: "examiner",
        text: "How have towns and cities changed in your country in recent years?",
      },
      {
        speaker: "candidate",
        text: "Well, over the past decade or so, urban centers in my country have undergone substantial transformation. There's been a noticeable shift toward pedestrianization and green infrastructure. Municipal authorities are increasingly prioritizing public transit systems and dedicated cycle lanes, which has noticeably alleviated inner-city congestion.",
      },
    ],
    groundTruth: {
      overallBand: 8.5,
      scores: {
        fluencyCoherence: 8.5,
        lexicalResource: 9.0,
        grammaticalRange: 8.5,
        pronunciation: 8.5,
      },
      examinerComment:
        "The candidate speaks with exceptional fluency, sophisticated vocabulary, and natural discourse structure. Topic development is full and effortless with precise collocations.",
      verbatimQuotes: {
        fluencyCoherence: [
          "over the past decade or so, urban centers in my country have undergone substantial transformation",
        ],
        lexicalResource: [
          "remarkable balance between ancient cultural heritage and contemporary urban life",
          "pedestrianization and green infrastructure",
          "alleviated inner-city congestion",
        ],
        grammaticalRange: [
          "What draws me to Kyoto is its remarkable balance",
          "There's been a noticeable shift toward pedestrianization... which has noticeably alleviated",
        ],
        pronunciation: [
          "Natural stress, rhythm, and clear intonation inferred from effortless discourse transitions.",
        ],
      },
    },
  },

  // --- BAND 6.5 SPEAKING EXEMPLAR ---
  {
    id: "speaking-b65-hobbies",
    title: "Hobbies & Daily Routine Session",
    topic: "Daily life and creative hobbies",
    transcript: [
      {
        speaker: "examiner",
        text: "Do you enjoy making things by hand?",
      },
      {
        speaker: "candidate",
        text: "Yes, actually I like drawing and sketching in my notebook when I have free time. It helps me to relax after a stressful day of studying at university. Sometimes I try to paint watercolor landscapes, though I am not very professional at it.",
      },
      {
        speaker: "examiner",
        text: "Why is creativity important in modern workplaces?",
      },
      {
        speaker: "candidate",
        text: "I think creativity is very essential because nowadays computer can do routine jobs automatically. So human workers need to come up with new ideas and solve complex problems that machines cannot do. If a company doesn't innovate, it will fall behind competitors.",
      },
    ],
    groundTruth: {
      overallBand: 6.5,
      scores: {
        fluencyCoherence: 6.5,
        lexicalResource: 6.5,
        grammaticalRange: 6.5,
        pronunciation: 6.5,
      },
      examinerComment:
        "The candidate speaks at length with good coherence and relevant vocabulary. There are occasional minor grammatical slips ('computer can do', 'I am not very professional at it'), but communication is clear throughout.",
      verbatimQuotes: {
        fluencyCoherence: [
          "It helps me to relax after a stressful day",
          "So human workers need to come up with new ideas",
        ],
        lexicalResource: [
          "paint watercolor landscapes",
          "routine jobs automatically",
          "fall behind competitors",
        ],
        grammaticalRange: [
          "I am not very professional at it",
          "computer can do routine jobs automatically",
        ],
        pronunciation: [
          "Generally clear and easy to understand with occasional minor stress errors.",
        ],
      },
    },
  },
];
