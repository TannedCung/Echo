import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LiveDirector, type DirectorActions } from "@/lib/ai/realtime/live-director";
import {
  ANSWER_SOFT_LIMIT_SECONDS,
  PART2_PREP_SECONDS,
  PART2_TALK_SECONDS,
  PART1_BUDGET_SECONDS,
} from "@/lib/ielts/examiner-flow";

function makeActions() {
  const directives: string[] = [];
  const phases: (ReturnType<typeof Object> | null)[] = [];
  const actions: DirectorActions = {
    instruct: (d) => directives.push(d),
    onPhase: (p) => phases.push(p),
  };
  return { actions, directives, phases };
}

describe("LiveDirector", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("interrupts an answer that runs past the soft limit, once", () => {
    const { actions, directives } = makeActions();
    const director = new LiveDirector("full_mock", actions);

    director.beginPart(1);
    director.noteCandidateActivity();
    director.noteCandidateActivity(); // still the same answer — must not double-arm

    vi.advanceTimersByTime(ANSWER_SOFT_LIMIT_SECONDS * 1000);
    const interrupts = directives.filter((d) => d.includes("Politely interrupt"));
    expect(interrupts).toHaveLength(1);
  });

  it("does not interrupt during the Part 2 long turn", () => {
    const { actions, directives } = makeActions();
    const director = new LiveDirector("full_mock", actions);

    director.startLongTurnPreparation();
    vi.advanceTimersByTime(PART2_PREP_SECONDS * 1000); // prep done → long turn begins
    director.noteCandidateActivity();
    vi.advanceTimersByTime(ANSWER_SOFT_LIMIT_SECONDS * 1000);

    expect(directives.some((d) => d.includes("Politely interrupt"))).toBe(false);
  });

  it("prompts the candidate to start after prep, then caps the long turn", () => {
    const { actions, directives } = makeActions();
    const director = new LiveDirector("full_mock", actions);

    director.startLongTurnPreparation();
    vi.advanceTimersByTime(PART2_PREP_SECONDS * 1000);
    expect(directives.some((d) => d.includes("preparation is over"))).toBe(true);

    vi.advanceTimersByTime(PART2_TALK_SECONDS * 1000);
    expect(directives.some((d) => d.includes("Gently stop"))).toBe(true);
  });

  it("emits a prep countdown that ticks down", () => {
    const { actions, phases } = makeActions();
    const director = new LiveDirector("full_mock", actions);

    director.startLongTurnPreparation();
    const first = phases.find((p) => p && (p as { stage?: string }).stage === "prep") as {
      countdown: number;
    };
    expect(first.countdown).toBe(PART2_PREP_SECONDS);

    vi.advanceTimersByTime(1000);
    const ticked = phases[phases.length - 1] as { countdown: number };
    expect(ticked.countdown).toBe(PART2_PREP_SECONDS - 1);
  });

  it("wraps up a part once its budget is spent", () => {
    const { actions, directives } = makeActions();
    const director = new LiveDirector("full_mock", actions);

    director.beginPart(1);
    vi.advanceTimersByTime(PART1_BUDGET_SECONDS * 1000);
    expect(directives.some((d) => d.includes("Part 1") && d.includes("Part 2"))).toBe(true);
  });

  it("clears timers on stop", () => {
    const { actions, directives, phases } = makeActions();
    const director = new LiveDirector("full_mock", actions);

    director.beginPart(1);
    director.noteCandidateActivity();
    director.stop();
    vi.advanceTimersByTime(PART1_BUDGET_SECONDS * 1000);

    expect(directives).toHaveLength(0);
    expect(phases[phases.length - 1]).toBeNull();
  });
});
