import { Mastra } from "@mastra/core";

import { examinerAgent } from "./agents/examiner-agent";
import { scorerAgent } from "./agents/scorer-agent";
import { writingScorerAgent } from "./agents/writing-scorer-agent";

/**
 * Central Mastra instance. Starting agentic-first means future capabilities —
 * a study-planner agent, per-criterion coach agents, multi-agent mock panels,
 * tools and memory — slot in here without re-architecting the app.
 */
export const mastra = new Mastra({
  agents: { examinerAgent, scorerAgent, writingScorerAgent },
});
