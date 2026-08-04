import type { WritingTaskType } from "./writing-descriptors";

/**
 * The Writing prompt library — the pool of Task 1 and Task 2 prompts Echo offers.
 * Task 1 (Academic) normally accompanies a chart or diagram; since Echo's MVP is
 * text-only, each Task 1 prompt describes its data in words so the exercise still
 * works without an image. Task 2 prompts are standard opinion/discussion essays.
 * This is the single source of truth for Writing content — surfaces render it and
 * the scorer agent is grounded on the selected prompt.
 */

export interface WritingPrompt {
  id: string;
  task: WritingTaskType;
  /** Short theme for the picker, e.g. "Remote work". */
  title: string;
  /** The full task instructions shown to the candidate. */
  prompt: string;
  /** Suggested time in minutes (20 for Task 1, 40 for Task 2). */
  suggestedMinutes: number;
  /** Optional chart, table, map, or diagram visual asset. */
  imageUrl?: string;
  imageAlt?: string;
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "t1-commuting-modes",
    task: "task1",
    title: "How people commute",
    suggestedMinutes: 20,
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320' width='100%' height='100%'><rect width='600' height='320' rx='12' fill='%230f172a'/><text x='300' y='32' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='16' font-weight='bold' text-anchor='middle'>Commuting Modes in City (2005 vs 2020)</text><rect x='200' y='50' width='16' height='12' rx='3' fill='%233b82f6'/><text x='222' y='61' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='12'>2005</text><rect x='310' y='50' width='16' height='12' rx='3' fill='%2314b8a6'/><text x='332' y='61' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='12'>2020</text><line x1='80' y1='90' x2='550' y2='90' stroke='%23334155' stroke-dasharray='4'/><text x='65' y='94' fill='%2364748b' font-family='system-ui, sans-serif' font-size='11'>60%25</text><line x1='80' y1='140' x2='550' y2='140' stroke='%23334155' stroke-dasharray='4'/><text x='65' y='144' fill='%2364748b' font-family='system-ui, sans-serif' font-size='11'>40%25</text><line x1='80' y1='190' x2='550' y2='190' stroke='%23334155' stroke-dasharray='4'/><text x='65' y='194' fill='%2364748b' font-family='system-ui, sans-serif' font-size='11'>20%25</text><line x1='80' y1='240' x2='550' y2='240' stroke='%23475569'/><text x='65' y='244' fill='%2364748b' font-family='system-ui, sans-serif' font-size='11'>0%25</text><rect x='110' y='102' width='36' height='138' rx='4' fill='%233b82f6'/><text x='128' y='96' fill='%2360a5fa' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>55%25</text><rect x='150' y='145' width='36' height='95' rx='4' fill='%2314b8a6'/><text x='168' y='139' fill='%232dd4bf' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>38%25</text><text x='148' y='265' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='12' text-anchor='middle'>Car</text><rect x='220' y='177' width='36' height='63' rx='4' fill='%233b82f6'/><text x='238' y='171' fill='%2360a5fa' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>25%25</text><rect x='260' y='155' width='36' height='85' rx='4' fill='%2314b8a6'/><text x='278' y='149' fill='%232dd4bf' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>34%25</text><text x='258' y='265' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='12' text-anchor='middle'>Public Transport</text><rect x='330' y='220' width='36' height='20' rx='4' fill='%233b82f6'/><text x='348' y='214' fill='%2360a5fa' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>8%25</text><rect x='370' y='195' width='36' height='45' rx='4' fill='%2314b8a6'/><text x='388' y='189' fill='%232dd4bf' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>18%25</text><text x='368' y='265' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='12' text-anchor='middle'>Cycling</text><rect x='440' y='210' width='36' height='30' rx='4' fill='%233b82f6'/><text x='458' y='204' fill='%2360a5fa' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>12%25</text><rect x='480' y='215' width='36' height='25' rx='4' fill='%2314b8a6'/><text x='498' y='209' fill='%232dd4bf' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>10%25</text><text x='478' y='265' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='12' text-anchor='middle'>Walking</text></svg>",
    imageAlt: "Commuting modes bar chart comparing 2005 and 2020",
    prompt:
      "The table below shows the percentage of workers in a city who used four different modes of transport to commute in 2005 and 2020.\n\n• Car: 55% (2005) → 38% (2020)\n• Public transport: 25% (2005) → 34% (2020)\n• Cycling: 8% (2005) → 18% (2020)\n• Walking: 12% (2005) → 10% (2020)\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t1-recycling-process",
    task: "task1",
    title: "Glass recycling process",
    suggestedMinutes: 20,
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 200' width='100%' height='100%'><rect width='640' height='200' rx='12' fill='%230f172a'/><text x='320' y='30' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='15' font-weight='bold' text-anchor='middle'>Glass Bottle Recycling Process</text><rect x='20' y='60' width='100' height='70' rx='8' fill='%231e293b' stroke='%2338bdf8' stroke-width='2'/><text x='70' y='90' fill='%2338bdf8' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>1. Collection</text><text x='70' y='110' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='10' text-anchor='middle'>Households</text><path d='M 125 95 L 140 95' stroke='%2364748b' stroke-width='2'/><rect x='145' y='60' width='100' height='70' rx='8' fill='%231e293b' stroke='%23818cf8' stroke-width='2'/><text x='195' y='90' fill='%23818cf8' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>2. Sorting</text><text x='195' y='110' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='10' text-anchor='middle'>By Colour</text><path d='M 250 95 L 265 95' stroke='%2364748b' stroke-width='2'/><rect x='270' y='60' width='100' height='70' rx='8' fill='%231e293b' stroke='%23fb7185' stroke-width='2'/><text x='320' y='90' fill='%23fb7185' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>3. Crushing</text><text x='320' y='110' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='10' text-anchor='middle'>Into Cullet</text><path d='M 375 95 L 390 95' stroke='%2364748b' stroke-width='2'/><rect x='395' y='60' width='100' height='70' rx='8' fill='%231e293b' stroke='%23facc15' stroke-width='2'/><text x='445' y='90' fill='%23facc15' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>4. Melting</text><text x='445' y='110' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='10' text-anchor='middle'>In Furnace</text><path d='M 500 95 L 515 95' stroke='%2364748b' stroke-width='2'/><rect x='520' y='60' width='100' height='70' rx='8' fill='%231e293b' stroke='%234ade80' stroke-width='2'/><text x='570' y='90' fill='%234ade80' font-family='system-ui, sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>5. Moulding</text><text x='570' y='110' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='10' text-anchor='middle'>New Bottles</text></svg>",
    imageAlt: "Flowchart showing glass bottle recycling stages",
    prompt:
      "The following describes the stages in the recycling of glass bottles.\n\nUsed glass bottles are first collected from households and businesses. They are then transported to a processing plant, where they are sorted by colour and cleaned. Next, the clean glass is crushed into small pieces called cullet. The cullet is melted in a furnace at high temperature, and the molten glass is moulded into new bottles. Finally, the new bottles are cooled, quality-checked, and delivered to shops.\n\nSummarise the information by describing the process as a sequence of stages. Write at least 150 words.",
  },
  {
    id: "t2-remote-work",
    task: "task2",
    title: "Remote work",
    suggestedMinutes: 40,
    prompt:
      "Many companies now allow employees to work from home for part or all of the week. Some people believe this benefits both workers and employers, while others think it does more harm than good.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
  {
    id: "t2-public-transport-funding",
    task: "task2",
    title: "Funding public transport",
    suggestedMinutes: 40,
    prompt:
      "Some people think that governments should spend money on improving public transport rather than on building new roads.\n\nTo what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
  {
    id: "t2-technology-childhood",
    task: "task2",
    title: "Technology and childhood",
    suggestedMinutes: 40,
    prompt:
      "Children today spend an increasing amount of their free time using digital devices such as tablets and smartphones. Some believe this is a positive development, while others are concerned about its effects.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
  {
    id: "t1-global-energy-consumption",
    task: "task1",
    title: "Energy consumption by source",
    suggestedMinutes: 20,
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 240' width='100%' height='100%'><rect width='600' height='240' rx='12' fill='%230f172a'/><text x='300' y='28' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='15' font-weight='bold' text-anchor='middle'>Global Energy Consumption by Source (2000–2020)</text><circle cx='140' cy='50' r='5' fill='%23f43f5e'/><text x='152' y='54' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='11'>Fossil Fuels</text><circle cx='270' cy='50' r='5' fill='%2310b981'/><text x='282' y='54' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='11'>Renewables</text><circle cx='400' cy='50' r='5' fill='%23a855f7'/><text x='412' y='54' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='11'>Nuclear</text><line x1='70' y1='75' x2='530' y2='75' stroke='%23334155' stroke-dasharray='4'/><text x='55' y='79' fill='%2364748b' font-family='system-ui, sans-serif' font-size='10'>80%25</text><line x1='70' y1='120' x2='530' y2='120' stroke='%23334155' stroke-dasharray='4'/><text x='55' y='124' fill='%2364748b' font-family='system-ui, sans-serif' font-size='10'>50%25</text><line x1='70' y1='165' x2='530' y2='165' stroke='%23334155' stroke-dasharray='4'/><text x='55' y='169' fill='%2364748b' font-family='system-ui, sans-serif' font-size='10'>20%25</text><line x1='70' y1='195' x2='530' y2='195' stroke='%23475569'/><text x='55' y='199' fill='%2364748b' font-family='system-ui, sans-serif' font-size='10'>0%25</text><text x='110' y='215' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle'>2000</text><text x='300' y='215' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle'>2010</text><text x='490' y='215' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle'>2020</text><path d='M 110 75 L 300 98 L 490 108' stroke='%23f43f5e' stroke-width='3' fill='none'/><path d='M 110 180 L 300 162 L 490 157' stroke='%2310b981' stroke-width='3' fill='none'/><path d='M 110 180 L 490 180' stroke='%23a855f7' stroke-width='3' fill='none'/></svg>",
    imageAlt: "Global energy consumption trend line chart 2000-2020",
    prompt:
      "The chart below shows global energy consumption by three major sources (Fossil Fuels, Nuclear, and Renewable Energy) between 2000 and 2020.\n\n• Fossil fuels: 80% (2000) → 65% (2020)\n• Renewable energy: 10% (2000) → 25% (2020)\n• Nuclear power: 10% (2000) → 10% (2020)\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t1-water-usage-by-sector",
    task: "task1",
    title: "Water usage by sector",
    suggestedMinutes: 20,
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 220' width='100%' height='100%'><rect width='540' height='220' rx='12' fill='%230f172a'/><text x='270' y='28' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='15' font-weight='bold' text-anchor='middle'>Global Water Consumption by Sector (2020)</text><circle cx='160' cy='120' r='60' fill='none' stroke='%2322c55e' stroke-width='32' stroke-dasharray='264 113'/><circle cx='160' cy='120' r='60' fill='none' stroke='%233b82f6' stroke-width='32' stroke-dasharray='75 301' stroke-dashoffset='-264'/><circle cx='160' cy='120' r='60' fill='none' stroke='%23f59e0b' stroke-width='32' stroke-dasharray='38 338' stroke-dashoffset='-339'/><text x='160' y='125' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='14' font-weight='bold' text-anchor='middle'>100%25</text><rect x='280' y='80' width='14' height='14' rx='3' fill='%2322c55e'/><text x='302' y='92' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='12' font-weight='bold'>Agriculture (70%25)</text><rect x='280' y='112' width='14' height='14' rx='3' fill='%233b82f6'/><text x='302' y='124' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='12' font-weight='bold'>Industry (20%25)</text><rect x='280' y='144' width='14' height='14' rx='3' fill='%23f59e0b'/><text x='302' y='156' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='12' font-weight='bold'>Domestic (10%25)</text></svg>",
    imageAlt: "Global water consumption donut chart by sector",
    prompt:
      "The data below presents the breakdown of global freshwater usage across three main sectors in 2020.\n\n• Agriculture: 70%\n• Industry & Manufacturing: 20%\n• Domestic & Household: 10%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t1-university-graduates-employment",
    task: "task1",
    title: "Graduate employment destinations",
    suggestedMinutes: 20,
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 580 240' width='100%' height='100%'><rect width='580' height='240' rx='12' fill='%230f172a'/><text x='290' y='28' fill='%23f8fafc' font-family='system-ui, sans-serif' font-size='15' font-weight='bold' text-anchor='middle'>University Graduate Destinations (2010 vs 2022)</text><rect x='190' y='45' width='14' height='10' rx='2' fill='%233b82f6'/><text x='210' y='54' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='11'>2010</text><rect x='290' y='45' width='14' height='10' rx='2' fill='%2314b8a6'/><text x='310' y='54' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='11'>2022</text><line x1='70' y1='75' x2='520' y2='75' stroke='%23334155' stroke-dasharray='4'/><text x='55' y='79' fill='%2364748b' font-family='system-ui, sans-serif' font-size='10'>75%25</text><line x1='70' y1='125' x2='520' y2='125' stroke='%23334155' stroke-dasharray='4'/><text x='55' y='129' fill='%2364748b' font-family='system-ui, sans-serif' font-size='10'>40%25</text><line x1='70' y1='175' x2='520' y2='175' stroke='%23475569'/><text x='55' y='179' fill='%2364748b' font-family='system-ui, sans-serif' font-size='10'>0%25</text><rect x='95' y='92' width='28' height='83' rx='3' fill='%233b82f6'/><rect x='125' y='80' width='28' height='95' rx='3' fill='%2314b8a6'/><text x='124' y='193' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle'>Full-time</text><rect x='205' y='151' width='28' height='24' rx='3' fill='%233b82f6'/><rect x='235' y='155' width='28' height='20' rx='3' fill='%2314b8a6'/><text x='234' y='193' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle'>Study</text><rect x='315' y='159' width='28' height='16' rx='3' fill='%233b82f6'/><rect x='345' y='163' width='28' height='12' rx='3' fill='%2314b8a6'/><text x='344' y='193' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle'>Freelance</text><rect x='425' y='164' width='28' height='11' rx='3' fill='%233b82f6'/><rect x='455' y='168' width='28' height='7' rx='3' fill='%2314b8a6'/><text x='454' y='193' fill='%23cbd5e1' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle'>Unemployed</text></svg>",
    imageAlt: "Graduate employment destinations chart 2010 vs 2022",
    prompt:
      "The table below shows the destination of university graduates in one country within six months of graduation in 2010 and 2022.\n\n• Full-time employment: 62% (2010) → 71% (2022)\n• Further study: 18% (2010) → 15% (2022)\n• Part-time / Freelance: 12% (2010) → 9% (2022)\n• Unemployed: 8% (2010) → 5% (2022)\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t2-artificial-intelligence-workplace",
    task: "task2",
    title: "AI and future workforce",
    suggestedMinutes: 40,
    prompt:
      "Artificial intelligence and automation are increasingly performing tasks previously handled by human workers. Some argue this will create widespread unemployment, while others believe it will generate new and better employment opportunities.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own experience. Write at least 250 words.",
  },
  {
    id: "t2-globalisation-cultural-identity",
    task: "task2",
    title: "Globalisation & local culture",
    suggestedMinutes: 40,
    prompt:
      "Globalisation has led to similar products, media, and lifestyles being adopted in countries across the world. Some believe this leads to a loss of traditional cultural identities, while others welcome the global integration.\n\nTo what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
];

export function getWritingPrompt(id: string): WritingPrompt | undefined {
  return WRITING_PROMPTS.find((prompt) => prompt.id === id);
}

export function writingPromptsForTask(task: WritingTaskType): WritingPrompt[] {
  return WRITING_PROMPTS.filter((prompt) => prompt.task === task);
}

/** Deterministic pick from a seed; no seed → the first prompt. */
export function pickWritingPrompt(seed?: string): WritingPrompt {
  if (!seed) return WRITING_PROMPTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return WRITING_PROMPTS[Math.abs(hash) % WRITING_PROMPTS.length];
}
