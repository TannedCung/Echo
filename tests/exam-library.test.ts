import { describe, expect, it } from "vitest";

import { EXAM_LIBRARY, getExam, pickExam, questionsForPart } from "@/lib/ielts/exam-library";
import { speakingScript } from "@/lib/ielts/speaking-script";

describe("exam library", () => {
  it("every set is a well-formed exam form", () => {
    expect(EXAM_LIBRARY.length).toBeGreaterThan(1);
    for (const exam of EXAM_LIBRARY) {
      expect(exam.part1.length).toBeGreaterThan(0);
      expect(exam.part1.every((q) => q.part === "part1")).toBe(true);
      expect(exam.part2.part).toBe("part2");
      expect(exam.part2.followUps.length).toBeGreaterThan(0);
      expect(exam.part3.part).toBe("part3");
    }
  });

  it("has unique set and question ids", () => {
    const setIds = EXAM_LIBRARY.map((e) => e.id);
    expect(new Set(setIds).size).toBe(setIds.length);

    const questionIds = EXAM_LIBRARY.flatMap((e) => [
      ...e.part1.map((q) => q.id),
      e.part2.id,
      e.part3.id,
    ]);
    expect(new Set(questionIds).size).toBe(questionIds.length);
  });

  it("questionsForPart spans the whole library", () => {
    expect(questionsForPart("part2")).toHaveLength(EXAM_LIBRARY.length);
  });
});

describe("pickExam", () => {
  it("is deterministic for a given seed", () => {
    expect(pickExam("session-abc").id).toBe(pickExam("session-abc").id);
  });

  it("defaults to the first set when unseeded", () => {
    expect(pickExam().id).toBe(EXAM_LIBRARY[0].id);
  });

  it("spreads different seeds across more than one set", () => {
    const chosen = new Set(Array.from({ length: 60 }, (_, i) => pickExam(`seed-${i}`).id));
    expect(chosen.size).toBeGreaterThan(1);
  });

  it("getExam round-trips every set id", () => {
    for (const exam of EXAM_LIBRARY) {
      expect(getExam(exam.id)?.id).toBe(exam.id);
    }
    expect(getExam("does-not-exist")).toBeUndefined();
  });
});

describe("speakingScript seeding", () => {
  it("produces the same script for the same seed and can differ across seeds", () => {
    const a1 = JSON.stringify(speakingScript("full_mock", "seed-a"));
    const a2 = JSON.stringify(speakingScript("full_mock", "seed-a"));
    expect(a1).toBe(a2);

    const variants = new Set(
      Array.from({ length: 30 }, (_, i) => JSON.stringify(speakingScript("full_mock", `s-${i}`))),
    );
    expect(variants.size).toBeGreaterThan(1);
  });
});
