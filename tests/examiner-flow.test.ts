import { describe, expect, it } from "vitest";

import {
  flowOrder,
  initialState,
  isCandidateTurn,
  isTerminal,
  nextState,
  type SpeakingMode,
} from "@/lib/ielts/examiner-flow";

describe("examiner-flow", () => {
  it("starts every mode at the intro", () => {
    const modes: SpeakingMode[] = ["part1", "part2", "part3", "full_mock"];
    for (const mode of modes) {
      expect(initialState(mode)).toBe("intro");
    }
  });

  it("walks a full mock through every phase to done", () => {
    let state = initialState("full_mock");
    const visited = [state];
    while (!isTerminal(state)) {
      state = nextState({ mode: "full_mock", state });
      visited.push(state);
    }
    expect(visited).toEqual(flowOrder("full_mock"));
    expect(state).toBe("done");
  });

  it("stays put once terminal", () => {
    expect(nextState({ mode: "part1", state: "done" })).toBe("done");
  });

  it("knows when the candidate should be speaking", () => {
    expect(isCandidateTurn("part1")).toBe(true);
    expect(isCandidateTurn("part2_talk")).toBe(true);
    expect(isCandidateTurn("part2_prep")).toBe(false);
    expect(isCandidateTurn("scoring")).toBe(false);
  });
});
