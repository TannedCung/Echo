import { describe, expect, it } from "vitest";

import {
  countWords,
  criterionLabel,
  overallWritingBand,
  roundToBand,
  WRITING_CRITERIA,
} from "@/lib/ielts/writing-descriptors";
import { writingScoringSchema } from "@/lib/ai/writing-scoring-schema";

describe("roundToBand", () => {
  it("rounds to the nearest half band", () => {
    expect(roundToBand(6.24)).toBe(6);
    expect(roundToBand(6.25)).toBe(6.5);
    expect(roundToBand(6.75)).toBe(7);
  });
});

describe("overallWritingBand", () => {
  it("averages the four criteria and rounds to a half band", () => {
    expect(
      overallWritingBand({
        taskResponse: 6,
        coherenceCohesion: 6.5,
        lexicalResource: 7,
        grammaticalRange: 6.5,
      }),
    ).toBe(6.5);
  });

  it("covers every criterion", () => {
    expect(WRITING_CRITERIA).toHaveLength(4);
  });
});

describe("criterionLabel", () => {
  it("uses Task Achievement for Task 1 and Task Response for Task 2", () => {
    expect(criterionLabel("taskResponse", "task1")).toBe("Task Achievement");
    expect(criterionLabel("taskResponse", "task2")).toBe("Task Response");
  });

  it("shares the other criterion labels across tasks", () => {
    expect(criterionLabel("lexicalResource", "task1")).toBe("Lexical Resource");
    expect(criterionLabel("lexicalResource", "task2")).toBe("Lexical Resource");
  });
});

describe("countWords", () => {
  it("counts whitespace-separated words", () => {
    expect(countWords("one two three")).toBe(3);
    expect(countWords("  spaced   out \n words ")).toBe(3);
  });

  it("returns 0 for empty input", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});

const validCriterion = {
  band: 6.5,
  evidence: ["a clear overview of the main trend"],
  comment: "Covers the key features with some development.",
};

describe("writingScoringSchema", () => {
  it("accepts a well-formed writing result", () => {
    const result = {
      taskResponse: validCriterion,
      coherenceCohesion: validCriterion,
      lexicalResource: { ...validCriterion, band: 6 },
      grammaticalRange: { ...validCriterion, band: 7 },
      overall: 6.5,
      upgrades: [
        "Add a clearer overview sentence at the start.",
        "Use a wider range of linking devices.",
        "Vary your sentence structures with more complex forms.",
      ],
      summary: "A well-organised response with room to widen your range.",
    };
    expect(writingScoringSchema.parse(result)).toMatchObject({ overall: 6.5 });
  });

  it("rejects non-half-band scores", () => {
    const bad = {
      taskResponse: { ...validCriterion, band: 6.3 },
      coherenceCohesion: validCriterion,
      lexicalResource: validCriterion,
      grammaticalRange: validCriterion,
      overall: 6.5,
      upgrades: ["a", "b", "c"],
      summary: "x",
    };
    expect(writingScoringSchema.safeParse(bad).success).toBe(false);
  });
});
