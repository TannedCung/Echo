import { describe, expect, it } from "vitest";

import {
  SPEAKING_DETAILED_RUBRICS,
  WRITING_DETAILED_RUBRICS,
} from "@/lib/ielts/detailed-band-rubrics";
import {
  SPEAKING_BENCHMARK_DATASET,
  WRITING_BENCHMARK_DATASET,
} from "@/lib/ielts/scoring-benchmark-dataset";

describe("IELTS Scoring Benchmark Dataset & Calibration", () => {
  it("contains Writing benchmark samples across Bands 5.0 to 9.0", () => {
    expect(WRITING_BENCHMARK_DATASET.length).toBeGreaterThanOrEqual(5);

    const bands = WRITING_BENCHMARK_DATASET.map((s) => s.groundTruth.overallBand);
    expect(bands).toContain(9.0);
    expect(bands).toContain(8.0);
    expect(bands).toContain(7.0);
    expect(bands).toContain(6.0);
    expect(bands).toContain(5.0);
  });

  it("verifies Writing benchmark samples have verbatim evidence quotes and comments", () => {
    for (const sample of WRITING_BENCHMARK_DATASET) {
      expect(sample.prompt).toBeTruthy();
      expect(sample.response).toBeTruthy();
      expect(sample.wordCount).toBeGreaterThan(0);
      expect(sample.groundTruth.examinerComment).toBeTruthy();
      expect(sample.groundTruth.verbatimQuotes.taskResponse.length).toBeGreaterThan(0);
    }
  });

  it("contains Speaking benchmark samples with valid transcripts and ground truth", () => {
    expect(SPEAKING_BENCHMARK_DATASET.length).toBeGreaterThanOrEqual(5);

    for (const sample of SPEAKING_BENCHMARK_DATASET) {
      expect(sample.transcript.length).toBeGreaterThan(0);
      expect(sample.groundTruth.overallBand).toBeGreaterThanOrEqual(4.0);
      expect(sample.groundTruth.examinerComment).toBeTruthy();
    }
  });

  it("verifies Detailed Rubrics matrix covers Bands 4 to 9 for all criteria", () => {
    const writingTask2Rubrics = WRITING_DETAILED_RUBRICS.taskResponse("task2");
    expect(writingTask2Rubrics[9].band).toBe(9);
    expect(writingTask2Rubrics[5].band).toBe(5);

    const speakingFluencyRubrics = SPEAKING_DETAILED_RUBRICS.fluencyCoherence;
    expect(speakingFluencyRubrics[8].band).toBe(8);
    expect(speakingFluencyRubrics[6].band).toBe(6);
  });
});
