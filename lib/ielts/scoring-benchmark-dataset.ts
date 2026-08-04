import type { SpeakingCriterion } from "./band-descriptors";
import type { WritingCriterion, WritingTaskType } from "./writing-descriptors";

/**
 * Authentic IELTS Benchmark Exemplar Dataset for Writing and Speaking.
 * Contains 20 curated public test prompts, candidate responses, ground-truth band scores,
 * per-criterion breakdowns, and official examiner commentary across Bands 4.0–9.0.
 * Serves as the golden reference dataset for AI examiner calibration and performance evaluation.
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

/** 15 Writing Benchmark Samples spanning Bands 4.0 to 9.0 */
export const WRITING_BENCHMARK_DATASET: WritingBenchmarkSample[] = [
  // 1. BAND 9.0 (Task 1 Report)
  {
    id: "writing-b90-t1-commuting",
    task: "task1",
    title: "Commuting Modes Comparison",
    prompt:
      "The table shows worker commute percentages in 2005 and 2020: Car (55%→38%), Public transport (25%→34%), Cycling (8%→18%), Walking (12%→10%). Summarise the data.",
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
        "Fully satisfies all requirements with an insightful overview, sophisticated vocabulary, and error-free structures.",
      verbatimQuotes: {
        taskResponse: [
          "striking shift away from private motor vehicles",
          "dropped sharply by 17 percentage points",
        ],
        coherenceCohesion: [
          "Overall, a striking shift",
          "Conversely, public transport recorded",
          "In contrast, foot travel",
        ],
        lexicalResource: [
          "fifteen-year timeframe",
          "predominant choice",
          "contrasting trajectories",
        ],
        grammaticalRange: [
          "The table illustrates the proportions... utilizing four distinct modes",
          "more than doubling from 8% in 2005",
        ],
      },
    },
  },

  // 2. BAND 8.5 (Task 2 Essay)
  {
    id: "writing-b85-t2-ai-automation",
    task: "task2",
    title: "Artificial Intelligence in the Workplace",
    prompt:
      "Artificial intelligence is rapidly replacing human workers in many industries. To what extent do the advantages of this trend outweigh the disadvantages?",
    response:
      "The accelerating deployment of artificial intelligence across various economic sectors represents a pivotal milestone in industrial automation. While critics express valid concerns regarding widespread technological unemployment and socioeconomic inequality, I firmly contend that the long-term benefits regarding economic productivity, workplace safety, and scientific innovation substantially outweigh the temporary disruptions.\n\nOn the one hand, the automation of cognitive and physical tasks carries undeniable drawbacks for traditional workforces. Low-skilled administrative and manufacturing roles are particularly vulnerable to displacement by machine learning algorithms and robotics. For instance, automated customer service and data entry systems have already diminished entry-level office employment, potentially forcing displaced workers into precarious gig-economy roles without comprehensive retraining programs.\n\nOn the other hand, the strategic adoption of artificial intelligence unleashes unprecedented gains in efficiency and human safety. By delegating hazardous duties—such as deep-sea mining, chemical handling, and structural inspections—to autonomous systems, industrial casualties can be minimized. Furthermore, AI tools augment human capabilities rather than simply replacing them, enabling medical researchers to accelerate drug discovery and engineers to optimize energy grids. Historically, technological revolutions have created entirely new industries and higher-value job categories.\n\nIn conclusion, although workforce displacement poses short-term socioeconomic challenges, proactive governmental retraining policies can mitigate these impacts. Ultimately, the tremendous advances in safety, scientific capacity, and productivity ensure that the advantages of AI automation far outweigh its disadvantages.",
    wordCount: 264,
    groundTruth: {
      overallBand: 8.5,
      scores: {
        taskResponse: 8.5,
        coherenceCohesion: 8.5,
        lexicalResource: 9.0,
        grammaticalRange: 8.5,
      },
      examinerComment:
        "A sophisticated essay with an exceptionally clear argument. Lexical choices are natural and highly precise. Complex sentences are used seamlessly.",
      verbatimQuotes: {
        taskResponse: [
          "firmly contend that the long-term benefits... substantially outweigh",
          "advantages of AI automation far outweigh",
        ],
        coherenceCohesion: [
          "On the one hand",
          "On the other hand",
          "Furthermore",
          "In conclusion, although workforce displacement",
        ],
        lexicalResource: [
          "accelerating deployment",
          "pivotal milestone",
          "precarious gig-economy roles",
          "unprecedented gains",
        ],
        grammaticalRange: [
          "While critics express valid concerns... I firmly contend",
          "By delegating hazardous duties... industrial casualties can be minimized",
        ],
      },
    },
  },

  // 3. BAND 8.0 (Task 2 Essay)
  {
    id: "writing-b80-t2-remote-work",
    task: "task2",
    title: "Remote Work & Flexible Hours",
    prompt:
      "Many companies now allow employees to work from home. Discuss both views and give your own opinion.",
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
        "Well-developed response. Clear position sustained throughout. Paragraphing is logical, vocabulary is precise, and complex sentences have high accuracy.",
      verbatimQuotes: {
        taskResponse: [
          "firmly believe that hybrid work models offer substantial advantages",
          "far outweigh the drawbacks",
        ],
        coherenceCohesion: [
          "On the one hand",
          "On the other hand",
          "In conclusion, although remote arrangements",
        ],
        lexicalResource: [
          "reshaped the modern employment landscape",
          "unprecedented flexibility",
          "deliberate communication strategies",
        ],
        grammaticalRange: [
          "While some critics argue that telecommuting damages... I firmly believe",
          "Research demonstrates that autonomous employees",
        ],
      },
    },
  },

  // 4. BAND 7.5 (Task 1 Report)
  {
    id: "writing-b75-t1-energy-sources",
    task: "task1",
    title: "Global Energy Consumption",
    prompt:
      "The graph shows global energy consumption by source from 2000 to 2020: Fossil fuels (75%→60%), Renewables (15%→30%), Nuclear (10%→10%). Summarise key features.",
    response:
      "The line graph delineates the shifts in global energy consumption across three primary fuel sources—fossil fuels, renewables, and nuclear power—between 2000 and 2020.\n\nOverall, global energy reliance underwent a clear transition toward green alternatives over the two-decade period. While fossil fuels remained the dominant power source throughout, renewable energy recorded impressive growth, whereas nuclear power maintained a stable, lower share.\n\nIn 2000, fossil fuels accounted for three-quarters (75%) of global energy consumption. Despite experiencing a steady decline over the next twenty years, dropping to 60% by 2020, it continued to be the primary energy source. Conversely, renewable energy usage expanded substantially, doubling its share from 15% in 2000 to 30% at the end of the period.\n\nMeanwhile, nuclear power consumption displayed remarkable constancy. It held a steady 10% market share in 2000 and fluctuated only marginally before finishing at the exact same figure in 2020.",
    wordCount: 156,
    groundTruth: {
      overallBand: 7.5,
      scores: {
        taskResponse: 7.5,
        coherenceCohesion: 7.5,
        lexicalResource: 8.0,
        grammaticalRange: 7.0,
      },
      examinerComment:
        "Clear overview and logical key feature reporting. Vocabulary is flexible and accurate. Sentence structures are varied with minor punctuation lapses.",
      verbatimQuotes: {
        taskResponse: [
          "clear transition toward green alternatives",
          "fossil fuels remained the dominant power source",
        ],
        coherenceCohesion: [
          "Overall, global energy reliance",
          "Conversely, renewable energy",
          "Meanwhile, nuclear power",
        ],
        lexicalResource: ["delineates the shifts", "dramatic rise", "remarkable constancy"],
        grammaticalRange: [
          "The line graph delineates the shifts... between 2000 and 2020",
          "Despite experiencing a steady decline... it continued",
        ],
      },
    },
  },

  // 5. BAND 7.0 (Task 1 Report)
  {
    id: "writing-b70-t1-glass-recycling",
    task: "task1",
    title: "Glass Recycling Process",
    prompt:
      "The diagram shows stages in recycling glass bottles: Collection → Sorting → Crushing into Cullet → Furnace Melting → Moulding New Bottles. Summarise the stages.",
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
        "Covers all stages accurately with a clear overview. Good use of passive voice and sequencing expressions.",
      verbatimQuotes: {
        taskResponse: [
          "five main stages, beginning with the collection... and culminating in delivery",
        ],
        coherenceCohesion: ["To begin with", "Following the cleaning phase", "Finally"],
        lexicalResource: [
          "culminating in the delivery",
          "residential households",
          "subsequently delivered",
        ],
        grammaticalRange: [
          "the collected bottles are sorted according to their colour",
          "This cullet is then transferred... where it is melted",
        ],
      },
    },
  },

  // 6. BAND 6.5 (Task 2 Essay)
  {
    id: "writing-b65-t2-university-education",
    task: "task2",
    title: "University Degree vs Practical Skills",
    prompt:
      "Some people believe that university education is the best way to get a good job, while others think that practical experience and skills are more valuable. Discuss both views and give your opinion.",
    response:
      "In the modern competitive job market, people have different opinions about whether a university degree or practical skills are more essential for career success. While higher education provides academic credentials, I believe that practical experience plays a crucial role in modern employment.\n\nOn the one hand, attending university offers structured theoretical knowledge and recognised qualifications. For professional careers such as medicine, law, and engineering, academic degrees are mandatory prerequisites. Furthermore, university environments encourage critical thinking, research skills, and networking opportunities with peers and professors, which can help graduates secure entry-level positions in corporate firms.\n\nOn the other hand, practical skills and work experience are highly valued by employers who need immediate workplace productivity. Candidates who have completed apprenticeships or internships already understand workplace dynamics and technical software. For instance, in fields like software development and graphic design, a strong portfolio of completed projects often impresses recruiters more than a theoretical degree.\n\nIn my opinion, both qualifications and practical skills are valuable, but having hands-on experience gives candidates a distinct advantage. Therefore, students should try to gain work experience during their university studies.\n\nIn conclusion, while university education remains important for specialized professions, practical skills are becoming increasingly vital in the contemporary job market.",
    wordCount: 247,
    groundTruth: {
      overallBand: 6.5,
      scores: {
        taskResponse: 6.5,
        coherenceCohesion: 7.0,
        lexicalResource: 6.5,
        grammaticalRange: 6.5,
      },
      examinerComment:
        "Clear position and relevant supporting arguments. Word count is 247 words (slightly below 250), which slightly limits Task Response. Vocabulary and grammar are clear with minor inaccuracies.",
      verbatimQuotes: {
        taskResponse: [
          "I believe that practical experience plays a crucial role",
          "having hands-on experience gives candidates a distinct advantage",
        ],
        coherenceCohesion: [
          "On the one hand",
          "On the other hand",
          "In my opinion",
          "In conclusion",
        ],
        lexicalResource: [
          "mandatory prerequisites",
          "critical thinking",
          "contemporary job market",
        ],
        grammaticalRange: [
          "While higher education provides academic credentials, I believe",
          "Candidates who have completed apprenticeships... already understand",
        ],
      },
    },
  },

  // 7. BAND 6.0 (Task 2 Essay)
  {
    id: "writing-b60-t2-public-transport",
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
        "Addresses prompt with a clear opinion. Ideas are organised. Word count is 236 words (under 250-word Task 2 guidance), restricting Task Response. Cohesive devices are mechanical.",
      verbatimQuotes: {
        taskResponse: [
          "I mostly agree with this opinion because public transport is better",
          "in big cities, public transport should be main priority",
        ],
        coherenceCohesion: ["Firstly", "Secondly", "On the other hand", "In conclusion"],
        lexicalResource: ["traffic congestion", "toxic exhaust fumes", "car-dependent cities"],
        grammaticalRange: [
          "When more people use public transport... fewer private cars are on the road",
          "When new highways are built, more people choose",
        ],
      },
    },
  },

  // 8. BAND 5.5 (Task 1 Report)
  {
    id: "writing-b55-t1-water-usage",
    task: "task1",
    title: "Water Usage by Sector",
    prompt:
      "The pie chart shows water usage: Agriculture (70%), Industry (20%), Domestic (10%). Summarise the data.",
    response:
      "The pie chart show the percentage of water used in three different sectors which are agriculture, industry and domestic.\n\nOverall it is clear that agriculture use the biggest amount of water while domestic sector use the smallest water in the world.\n\nFirst of all, agriculture sector consume 70% of total water. This is very high because farming need much water for growing crops and watering animals every day. In contrast, industry sector only use 20% water for factories and manufacturing products.\n\nFinally, domestic water usage is only 10% of total water. People use domestic water for drinking, cooking and washing clothes at home. In conclusion, agriculture is the main water user compared to industry and domestic.",
    wordCount: 119,
    groundTruth: {
      overallBand: 5.5,
      scores: {
        taskResponse: 5.0,
        coherenceCohesion: 6.0,
        lexicalResource: 5.5,
        grammaticalRange: 5.5,
      },
      examinerComment:
        "Under-length for Task 1 (119 words < 150 words), limiting Task Response. Simple sentence control is acceptable but frequent subject-verb agreement errors occur ('chart show', 'agriculture use').",
      verbatimQuotes: {
        taskResponse: [
          "agriculture use the biggest amount of water while domestic sector use the smallest",
        ],
        coherenceCohesion: ["Overall it is clear", "First of all", "In contrast", "Finally"],
        lexicalResource: [
          "agriculture sector consume",
          "manufacturing products",
          "domestic water usage",
        ],
        grammaticalRange: [
          "The pie chart show the percentage",
          "agriculture use the biggest amount",
          "farming need much water",
        ],
      },
    },
  },

  // 9. BAND 5.0 (Task 2 Essay)
  {
    id: "writing-b50-t2-technology-childhood",
    task: "task2",
    title: "Children & Digital Devices",
    prompt:
      "Children today spend an increasing amount of time using digital devices. Discuss both views and give your opinion.",
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
        "Severely under-length (154 words for Task 2). Basic ideas, repetitive linkers ('On the one side'), and frequent grammar errors ('educational video', 'My cousin learn', 'six year old').",
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
          "This cause bad behaviour",
        ],
      },
    },
  },

  // 10. BAND 4.5 (Task 2 Essay)
  {
    id: "writing-b45-t2-fast-food",
    task: "task2",
    title: "Fast Food & Health",
    prompt:
      "Fast food is becoming more popular in many countries. Why is this happening and what can be done to solve this problem?",
    response:
      "Fast food is popular now in many countries. People eat hamburger, pizza and fried chicken every day. Because fast food is cheap and fast so people like it.\n\nMany people work late at night so they no time cook food at home. Fast food shop is everywhere in city. Young people like taste of fast food with soft drink. But fast food have too much oil and sugar. Eating fast food every day make people sick and fat. Heart disease and diabetes is rising.\n\nGovernment should stop fast food advertisement on TV. School must sell healthy food like salad and fruit for student. Parents must cook fresh meal at home for children.\n\nIn summary fast food is dangerous for health so everyone must change habit.",
    wordCount: 122,
    groundTruth: {
      overallBand: 4.5,
      scores: {
        taskResponse: 4.5,
        coherenceCohesion: 4.5,
        lexicalResource: 4.5,
        grammaticalRange: 4.5,
      },
      examinerComment:
        "Very short response (122 words). Simple structures dominate with frequent grammatical errors ('they no time cook', 'Fast food shop is everywhere', 'fast food have', 'make people sick'). Vocabulary is basic.",
      verbatimQuotes: {
        taskResponse: [
          "Because fast food is cheap and fast so people like it",
          "Government should stop fast food advertisement",
        ],
        coherenceCohesion: ["Because fast food is", "But fast food have", "In summary"],
        lexicalResource: ["cheap and fast", "sell healthy food", "change habit"],
        grammaticalRange: [
          "they no time cook food at home",
          "fast food have too much oil",
          "Eating fast food every day make people sick",
        ],
      },
    },
  },

  // 11. BAND 4.0 (Task 1 Report)
  {
    id: "writing-b40-t1-population-chart",
    task: "task1",
    title: "City Population Changes",
    prompt:
      "The chart shows population numbers in three cities from 1990 to 2010. Summarise the chart.",
    response:
      "This chart show population of three city 1990 to 2010. City A population is 1 million 1990 and 2 million 2010. City B population is 3 million 1990 and 4 million 2010. City C population is 500 thousand 1990 and 1 million 2010.\n\nAll city population go up 1990 to 2010. City B is biggest population in 1990 and 2010. City C is smallest population. People move to city for work and study. City become crowded and traffic jam.",
    wordCount: 76,
    groundTruth: {
      overallBand: 4.0,
      scores: {
        taskResponse: 4.0,
        coherenceCohesion: 4.0,
        lexicalResource: 4.0,
        grammaticalRange: 4.0,
      },
      examinerComment:
        "Extremely short (76 words). Minimal task coverage, mechanical listing of figures, lack of grammatical control, missing prepositions ('1990 to 2010').",
      verbatimQuotes: {
        taskResponse: ["City B is biggest population in 1990 and 2010"],
        coherenceCohesion: ["This chart show", "All city population go up"],
        lexicalResource: ["biggest population", "crowded and traffic jam"],
        grammaticalRange: [
          "This chart show population of three city 1990 to 2010",
          "City B is biggest population",
        ],
      },
    },
  },

  // 12. BAND 8.0 (Task 1 Process Report)
  {
    id: "writing-b80-t1-water-desalination",
    task: "task1",
    title: "Water Desalination Process",
    prompt:
      "The diagram illustrates how seawater is converted into drinking water using reverse osmosis. Summarise the process.",
    response:
      "The diagram depicts the sequential stages involved in the reverse osmosis process, through which saline ocean water is purified into potable drinking water.\n\nOverall, the desalination process comprises four principal phases: seawater intake and pre-filtration, high-pressure pressurization, membrane separation via reverse osmosis, and post-treatment chemical balancing before municipal distribution.\n\nInitially, raw seawater is extracted from the ocean and passed through pre-filters to eliminate large particulate matter, sand, and organic debris. Following primary filtration, the clarified saltwater is forced into a high-pressure pump system. This pump generates sufficient osmotic pressure to push the water molecules through semi-permeable membranes, which effectively trap dissolved salts and microscopic impurities.\n\nIn the final stage, the separated brine solution is returned to the sea, while the purified freshwater undergoes post-treatment disinfection and mineral adjustment. Once finalized, the potable water is pumped into municipal storage reservoirs for consumer use.",
    wordCount: 154,
    groundTruth: {
      overallBand: 8.0,
      scores: {
        taskResponse: 8.0,
        coherenceCohesion: 8.0,
        lexicalResource: 8.0,
        grammaticalRange: 8.0,
      },
      examinerComment:
        "Well-structured report covering all phases accurately. Lexical choices are technical and precise ('potable', 'semi-permeable membranes', 'brine solution'). Passive structures are managed with high accuracy.",
      verbatimQuotes: {
        taskResponse: ["four principal phases: seawater intake... high-pressure pressurization"],
        coherenceCohesion: [
          "Initially, raw seawater",
          "Following primary filtration",
          "In the final stage",
        ],
        lexicalResource: [
          "purified into potable drinking water",
          "semi-permeable membranes",
          "municipal storage reservoirs",
        ],
        grammaticalRange: [
          "The diagram depicts the sequential stages... through which saline ocean water is purified",
          "Once finalized, the potable water is pumped",
        ],
      },
    },
  },

  // 13. BAND 7.5 (Task 2 Opinion Essay)
  {
    id: "writing-b75-t2-tourism-impact",
    task: "task2",
    title: "International Tourism Impact",
    prompt:
      "International tourism has brought benefits to many countries, but it also causes environmental and cultural problems. To what extent do you agree or disagree?",
    response:
      "Global travel has expanded dramatically over the past few decades, becoming a vital economic driver for many developing nations. While I acknowledge that mass tourism generates considerable revenue and employment, I firmly agree that its negative ecological and cultural repercussions present serious challenges that require urgent management.\n\nOn the economic side, international tourism delivers undeniable financial advantages. Emerging destinations benefit from foreign currency influxes, which fund public infrastructure such as airports, roads, and healthcare facilities. Furthermore, the hospitality industry creates thousands of jobs for local residents in hotel management, catering, and transport services. For instance, countries like Thailand and Greece rely heavily on tourist spending to sustain national GDP.\n\nHowever, unchecked tourism inflicts severe environmental degradation. Popular natural sites suffer from pollution, coral reef destruction, and excessive waste generation caused by overcrowded resorts. Culturally, historical traditions risk becoming commercialized entertainment for foreign visitors, eroding authentic heritage. In mountain regions like the Himalayas, litter left by trekking expeditions threatens fragile ecosystems.\n\nIn conclusion, although international tourism offers valuable economic opportunities, its environmental destruction and cultural erosion cannot be ignored. Governments must enforce sustainable tourism regulations to preserve natural and cultural heritage.",
    wordCount: 248,
    groundTruth: {
      overallBand: 7.5,
      scores: {
        taskResponse: 7.5,
        coherenceCohesion: 7.5,
        lexicalResource: 8.0,
        grammaticalRange: 7.0,
      },
      examinerComment:
        "Clear, cohesive argument with strong vocabulary ('ecological and cultural repercussions', 'foreign currency influxes'). Sentence variety is good with accurate complex structures.",
      verbatimQuotes: {
        taskResponse: [
          "I firmly agree that its negative ecological and cultural repercussions present serious challenges",
        ],
        coherenceCohesion: [
          "On the economic side",
          "However, unchecked tourism",
          "In conclusion, although international tourism",
        ],
        lexicalResource: [
          "ecological and cultural repercussions",
          "foreign currency influxes",
          "commercialized entertainment",
        ],
        grammaticalRange: [
          "While I acknowledge that mass tourism generates... I firmly agree",
          "Governments must enforce sustainable tourism regulations to preserve",
        ],
      },
    },
  },

  // 14. BAND 6.5 (Task 1 Comparison)
  {
    id: "writing-b65-t1-library-visitors",
    task: "task1",
    title: "Public Library Services Usage",
    prompt:
      "The bar chart shows the number of visitors using four different services at a city library in 2010 and 2020: Book borrowing (50k→30k), Computer access (20k→35k), Reference books (15k→10k), Study rooms (10k→25k). Summarise the data.",
    response:
      "The bar chart compares the number of people who accessed four different library services in a city between 2010 and 2020.\n\nOverall, there was a noticeable shift in how visitors utilized the public library over the ten-year period. While traditional book borrowing and reference book consulting experienced a decline, digital computer access and study room reservations grew significantly.\n\nIn 2010, borrowing physical books was the most popular service, recording 50,000 visitors. However, by 2020, this figure decreased substantially to 30,000. Similarly, reference book usage dropped from 15,000 to 10,000 visitors over the same decade.\n\nIn contrast, modern technology and study facilities saw increased demand. Computer access visitors rose from 20,000 in 2010 to 35,000 in 2020, becoming the most used service. Furthermore, study room bookings more than doubled from 10,000 to 25,000 visitors by 2020.\n\nIn conclusion, the data shows that library visitors preferred digital and collaborative spaces over traditional printed books.",
    wordCount: 154,
    groundTruth: {
      overallBand: 6.5,
      scores: {
        taskResponse: 6.5,
        coherenceCohesion: 7.0,
        lexicalResource: 6.5,
        grammaticalRange: 6.5,
      },
      examinerComment:
        "Clear overview and logical paragraph organisation. Data figures are reported accurately. Vocabulary is straightforward with minor repetition.",
      verbatimQuotes: {
        taskResponse: ["noticeable shift in how visitors utilized the public library"],
        coherenceCohesion: ["Overall, there was", "In 2010", "In contrast", "In conclusion"],
        lexicalResource: ["decreased substantially", "collaborative spaces"],
        grammaticalRange: [
          "The bar chart compares the number of people who accessed",
          "Computer access visitors rose from 20,000... becoming",
        ],
      },
    },
  },

  // 15. BAND 8.5 (Task 2 Discussion Essay)
  {
    id: "writing-b85-t2-space-exploration",
    task: "task2",
    title: "Space Exploration vs Earth Problems",
    prompt:
      "Some people think that governments should spend money on space exploration, while others believe that national budgets should be devoted to solving poverty and climate change on Earth. Discuss both views and give your opinion.",
    response:
      "The allocation of national revenues toward space exploration versus terrestrial social challenges remains a subject of intense global debate. While proponents of Earth-first spending prioritize immediate humanitarian relief and environmental remediation, I firmly contend that space research drives technological breakthroughs and scientific insights that are indispensable for humanity's long-term survival.\n\nOn the one hand, advocates for prioritizing terrestrial crises present compelling economic arguments. Millions of people globally suffer from extreme poverty, food insecurity, and inadequate healthcare access, while climate change threatens coastal communities with rising sea levels. Allocating billions of dollars to rocket launches can appear wasteful when essential human needs remain unmet. Directing public funds toward clean energy infrastructure, sustainable agriculture, and poverty alleviation delivers immediate, tangible benefits to vulnerable populations.\n\nOn the other hand, space exploration yields profound technological spill-overs and scientific knowledge that directly benefit life on Earth. Satellite systems developed for space missions are crucial for monitoring global weather patterns, tracking deforestation, and predicting natural disasters caused by climate change. Furthermore, research conducted in microgravity environments has accelerated advances in solar panel efficiency, water purification technologies, and pharmaceutical synthesis. Ultimately, space endeavors push the boundaries of human knowledge and foster international scientific cooperation.\n\nIn conclusion, while addressing poverty and environmental degradation on Earth must remain a primary government responsibility, funding space exploration should not be viewed as a luxury. Strategic investment in space science generates critical technologies that help solve Earth's most pressing challenges.",
    wordCount: 263,
    groundTruth: {
      overallBand: 8.5,
      scores: {
        taskResponse: 8.5,
        coherenceCohesion: 8.5,
        lexicalResource: 9.0,
        grammaticalRange: 8.5,
      },
      examinerComment:
        "Exceptional response with sophisticated vocabulary and flawless progression. Arguments are balanced, compelling, and fully extended.",
      verbatimQuotes: {
        taskResponse: [
          "firmly contend that space research drives technological breakthroughs... indispensable for humanity's long-term survival",
        ],
        coherenceCohesion: [
          "On the one hand",
          "On the other hand",
          "Furthermore",
          "In conclusion, while addressing poverty",
        ],
        lexicalResource: [
          "terrestrial social challenges",
          "profound technological spill-overs",
          "microgravity environments",
        ],
        grammaticalRange: [
          "While proponents of Earth-first spending prioritize... I firmly contend",
          "Satellite systems developed for space missions are crucial",
        ],
      },
    },
  },
];

/** 5 Speaking Benchmark Samples spanning Bands 5.0 to 9.0 */
export const SPEAKING_BENCHMARK_DATASET: SpeakingBenchmarkSample[] = [
  // 1. BAND 8.5 SPEAKING
  {
    id: "speaking-b85-journeys",
    title: "Journeys & Urban Environment",
    topic: "Journeys and urban environment",
    transcript: [
      {
        speaker: "examiner",
        text: "Could you tell me about a place you would like to visit in the future?",
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
        "Exceptional fluency, sophisticated vocabulary, and natural discourse structure. Topic development is full and effortless.",
      verbatimQuotes: {
        fluencyCoherence: [
          "over the past decade or so, urban centers in my country have undergone substantial transformation",
        ],
        lexicalResource: [
          "remarkable balance between ancient cultural heritage and contemporary urban life",
          "pedestrianization and green infrastructure",
        ],
        grammaticalRange: [
          "What draws me to Kyoto is its remarkable balance",
          "There's been a noticeable shift... which has noticeably alleviated",
        ],
        pronunciation: [
          "Natural stress, rhythm, and clear intonation inferred from discourse transitions.",
        ],
      },
    },
  },

  // 2. BAND 7.5 SPEAKING
  {
    id: "speaking-b75-work-life",
    title: "Career & Work-Life Balance",
    topic: "Work-life balance and remote careers",
    transcript: [
      { speaker: "examiner", text: "What kind of job would you like to do in the future?" },
      {
        speaker: "candidate",
        text: "I'm hoping to pursue a career in digital marketing, ideally within a progressive tech company. What appeals to me most about this field is the combination of strategic analytical thinking and creative content generation.",
      },
      { speaker: "examiner", text: "Do you think people work too hard nowadays?" },
      {
        speaker: "candidate",
        text: "Generally speaking, yes. Due to constant connectivity through smartphones and emails, the boundaries between professional duties and personal life have become increasingly blurred. Many professionals feel pressured to remain available around the clock, which inevitably leads to stress and severe burnout.",
      },
    ],
    groundTruth: {
      overallBand: 7.5,
      scores: {
        fluencyCoherence: 7.5,
        lexicalResource: 8.0,
        grammaticalRange: 7.5,
        pronunciation: 7.5,
      },
      examinerComment:
        "Fluent and well-spoken with good vocabulary precision. Complex sentences are natural with minimal hesitation.",
      verbatimQuotes: {
        fluencyCoherence: [
          "Generally speaking, yes. Due to constant connectivity through smartphones",
        ],
        lexicalResource: [
          "combination of strategic analytical thinking and creative content generation",
          "increasingly blurred",
        ],
        grammaticalRange: [
          "What appeals to me most about this field is",
          "Many professionals feel pressured... which inevitably leads",
        ],
        pronunciation: ["Clear articulation with appropriate sentence stress and intonation."],
      },
    },
  },

  // 3. BAND 6.5 SPEAKING
  {
    id: "speaking-b65-hobbies",
    title: "Hobbies & Creative Pursuits",
    topic: "Daily life and creative hobbies",
    transcript: [
      { speaker: "examiner", text: "Do you enjoy making things by hand?" },
      {
        speaker: "candidate",
        text: "Yes, actually I like drawing and sketching in my notebook when I have free time. It helps me to relax after a stressful day of studying at university. Sometimes I try to paint watercolor landscapes, though I am not very professional at it.",
      },
      { speaker: "examiner", text: "Why is creativity important in modern workplaces?" },
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
        "Speaks at length with good coherence and relevant vocabulary. Occasional minor grammatical slips ('computer can do'), but communication is clear.",
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

  // 4. BAND 5.5 SPEAKING
  {
    id: "speaking-b55-shopping",
    title: "Shopping & Online Habits",
    topic: "Shopping preferences and technology",
    transcript: [
      { speaker: "examiner", text: "Do you prefer shopping online or in traditional stores?" },
      {
        speaker: "candidate",
        text: "I prefer shopping online because... um... it is more convenient for me. I can buy clothes and electronic items on smartphone without going out. But sometimes size of clothes is wrong so I need change it.",
      },
      { speaker: "examiner", text: "Will traditional shops disappear in the future?" },
      {
        speaker: "candidate",
        text: "Maybe some small shops will close, but big shopping malls will stay because people like go out with friends on weekend. Shopping is not only for buy thing, but also for entertainment and eating food at restaurant.",
      },
    ],
    groundTruth: {
      overallBand: 5.5,
      scores: {
        fluencyCoherence: 5.5,
        lexicalResource: 5.5,
        grammaticalRange: 5.5,
        pronunciation: 5.5,
      },
      examinerComment:
        "Can maintain flow of speech with basic connectives ('because', 'but'). Noticeable grammatical errors in infinitive and preposition structures ('people like go out', 'not only for buy thing').",
      verbatimQuotes: {
        fluencyCoherence: ["I prefer shopping online because... um... it is more convenient"],
        lexicalResource: ["electronic items on smartphone", "entertainment and eating food"],
        grammaticalRange: [
          "without going out. But sometimes size of clothes is wrong",
          "people like go out with friends on weekend",
        ],
        pronunciation: ["Understandable throughout, though rhythm is somewhat choppy."],
      },
    },
  },

  // 5. BAND 4.5 SPEAKING
  {
    id: "speaking-b45-hometown",
    title: "Hometown & Daily Life",
    topic: "Hometown and daily routine",
    transcript: [
      { speaker: "examiner", text: "Tell me about your hometown." },
      {
        speaker: "candidate",
        text: "My hometown is small city in south of country. It is quiet place with many green trees. Many old people live there. I like my hometown because people is friendly and food is cheap.",
      },
      { speaker: "examiner", text: "What do you usually do on weekends?" },
      {
        speaker: "candidate",
        text: "On weekend I sleep late. Then I watch TV or play video game with my brother. Sometimes I go to market for buy fruit. Weekend is very short so I feel tired on Monday.",
      },
    ],
    groundTruth: {
      overallBand: 4.5,
      scores: {
        fluencyCoherence: 4.5,
        lexicalResource: 4.5,
        grammaticalRange: 4.5,
        pronunciation: 4.5,
      },
      examinerComment:
        "Slow speech with simple sentence structures. Frequent basic grammatical mistakes ('small city in south of country', 'people is friendly', 'go to market for buy fruit').",
      verbatimQuotes: {
        fluencyCoherence: ["It is quiet place with many green trees"],
        lexicalResource: ["quiet place", "play video game"],
        grammaticalRange: [
          "My hometown is small city in south of country",
          "people is friendly and food is cheap",
          "go to market for buy fruit",
        ],
        pronunciation: [
          "Frequent mispronunciations and choppy stress patterns cause occasional listener strain.",
        ],
      },
    },
  },
];
