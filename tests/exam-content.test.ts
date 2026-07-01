import { describe, expect, it } from "vitest";

import { LISTENING_BAND_TABLE, LISTENING_TESTS } from "@/lib/ielts/listening-tests";
import {
  isCorrect,
  optionsFor,
  type BandTable,
  type ObjectiveQuestion,
} from "@/lib/ielts/objective-scoring";
import { READING_BAND_TABLE, READING_TESTS } from "@/lib/ielts/reading-tests";
import { WRITING_PROMPTS } from "@/lib/ielts/writing-prompts";

/**
 * Content-integrity checks: the objective papers only score correctly if every
 * question is internally consistent — the canonical answer is actually accepted,
 * multiple-choice answers appear among the options, and ids are unique.
 */
function assertQuestionsSound(questions: ObjectiveQuestion[]) {
  const ids = new Set<string>();
  for (const q of questions) {
    expect(ids.has(q.id), `duplicate id ${q.id}`).toBe(false);
    ids.add(q.id);
    expect(q.answers.length, `no answer for ${q.id}`).toBeGreaterThan(0);
    // The canonical answer must be graded as correct.
    expect(isCorrect(q, q.answers[0]), `canonical answer wrong for ${q.id}`).toBe(true);
    // Choice-type answers must be one of the presented options.
    const options = optionsFor(q);
    if (options.length > 0) {
      expect(options, `answer not an option for ${q.id}`).toContain(q.answers[0]);
    }
  }
}

function assertTableOrdered(table: BandTable) {
  for (let i = 1; i < table.length; i += 1) {
    expect(table[i - 1][0]).toBeGreaterThan(table[i][0]);
    expect(table[i - 1][1]).toBeGreaterThanOrEqual(table[i][1]);
  }
  // Top threshold must map to band 9.
  expect(table[0][1]).toBe(9);
}

describe("reading tests", () => {
  it("has unique test ids", () => {
    const ids = READING_TESTS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const test of READING_TESTS) {
    it(`"${test.title}" has sound questions and a non-empty passage`, () => {
      expect(test.passage.length).toBeGreaterThan(0);
      expect(test.questions.length).toBeGreaterThan(0);
      assertQuestionsSound(test.questions);
    });
  }

  it("has an ordered band table", () => assertTableOrdered(READING_BAND_TABLE));
});

describe("listening tests", () => {
  it("has unique test ids", () => {
    const ids = LISTENING_TESTS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const test of LISTENING_TESTS) {
    it(`"${test.title}" has sound questions and a non-empty transcript`, () => {
      expect(test.transcript.length).toBeGreaterThan(0);
      expect(test.questions.length).toBeGreaterThan(0);
      assertQuestionsSound(test.questions);
    });
  }

  it("has an ordered band table", () => assertTableOrdered(LISTENING_BAND_TABLE));
});

describe("writing prompts", () => {
  it("has unique ids and both task types", () => {
    const ids = WRITING_PROMPTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(WRITING_PROMPTS.some((p) => p.task === "task1")).toBe(true);
    expect(WRITING_PROMPTS.some((p) => p.task === "task2")).toBe(true);
  });
});
