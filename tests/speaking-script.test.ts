import { describe, expect, it } from "vitest";

import { planTurn, speakingScript } from "@/lib/ielts/speaking-script";

describe("speakingScript", () => {
  it("part1 is a sequence of question moves", () => {
    const script = speakingScript("part1");
    expect(script.length).toBeGreaterThan(0);
    expect(script.every((m) => m.kind === "question" && m.part === "part1")).toBe(true);
  });

  it("part2 is a single cue-card long turn", () => {
    const script = speakingScript("part2");
    expect(script).toHaveLength(1);
    const move = script[0];
    expect(move.kind).toBe("cue_card");
    if (move.kind === "cue_card") {
      expect(move.bullets.length).toBeGreaterThan(0);
      expect(move.prepSeconds).toBe(60);
      expect(move.talkSeconds).toBe(120);
    }
  });

  it("full_mock runs part1 → part2 cue card → part3 in order", () => {
    const parts = speakingScript("full_mock").map((m) =>
      m.kind === "cue_card" ? "part2" : m.kind === "question" ? m.part : "closing",
    );
    const firstP2 = parts.indexOf("part2");
    const firstP3 = parts.indexOf("part3");
    expect(parts[0]).toBe("part1");
    expect(firstP2).toBeGreaterThan(0);
    expect(firstP3).toBeGreaterThan(firstP2);
    expect(parts.filter((p) => p === "part2")).toHaveLength(1);
  });
});

describe("planTurn", () => {
  it("flags the opening turn", () => {
    const { isFirst, partChanged, complete } = planTurn("part1", 0);
    expect(isFirst).toBe(true);
    expect(partChanged).toBe(true);
    expect(complete).toBe(false);
  });

  it("marks part transitions in a full mock", () => {
    const script = speakingScript("full_mock");
    const cueIndex = script.findIndex((m) => m.kind === "cue_card");
    expect(planTurn("full_mock", cueIndex).partChanged).toBe(true);
  });

  it("returns the closing move once the script is exhausted", () => {
    const len = speakingScript("part1").length;
    const planned = planTurn("part1", len);
    expect(planned.complete).toBe(true);
    expect(planned.move.kind).toBe("closing");
  });
});
