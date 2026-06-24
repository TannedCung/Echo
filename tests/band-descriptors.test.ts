import { describe, expect, it } from "vitest";

import { overallBand, roundToBand, SPEAKING_CRITERIA } from "@/lib/ielts/band-descriptors";

describe("band math", () => {
  it("rounds to the nearest half band", () => {
    expect(roundToBand(6.24)).toBe(6);
    expect(roundToBand(6.25)).toBe(6.5);
    expect(roundToBand(6.75)).toBe(7);
  });

  it("averages the four criteria to an overall half band", () => {
    const scores = {
      fluencyCoherence: 7,
      lexicalResource: 6,
      grammaticalRange: 6,
      pronunciation: 7,
    };
    // mean = 6.5 → already a half band
    expect(overallBand(scores)).toBe(6.5);
  });

  it("covers exactly the four official criteria", () => {
    expect(SPEAKING_CRITERIA).toHaveLength(4);
  });
});
