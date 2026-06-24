import { describe, expect, it } from "vitest";

import { scoringSchema } from "@/lib/ai/scoring-schema";

const validCriterion = {
  band: 6.5,
  evidence: ["I really enjoy hiking on weekends"],
  comment: "Speaks at length with occasional hesitation.",
};

const validResult = {
  fluencyCoherence: validCriterion,
  lexicalResource: validCriterion,
  grammaticalRange: { ...validCriterion, band: 6 },
  pronunciation: { ...validCriterion, band: 7 },
  overall: 6.5,
  upgrades: [
    "Use more discourse markers like 'on the other hand'.",
    "Try a wider range of past tenses.",
    "Stress content words to vary your rhythm.",
  ],
  summary: "A solid, communicative performance with room to stretch your range.",
};

describe("scoringSchema", () => {
  it("accepts a well-formed scorer result", () => {
    expect(scoringSchema.parse(validResult)).toMatchObject({ overall: 6.5 });
  });

  it("rejects non-half-band scores", () => {
    const bad = { ...validResult, overall: 6.3 };
    expect(scoringSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects bands outside 0–9", () => {
    const bad = { ...validResult, pronunciation: { ...validCriterion, band: 10 } };
    expect(scoringSchema.safeParse(bad).success).toBe(false);
  });

  it("requires at least three upgrade suggestions", () => {
    const bad = { ...validResult, upgrades: ["only one"] };
    expect(scoringSchema.safeParse(bad).success).toBe(false);
  });
});
