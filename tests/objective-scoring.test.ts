import { describe, expect, it } from "vitest";

import {
  gradeAnswers,
  isCorrect,
  optionsFor,
  rawToBand,
  toPublicQuestion,
  type BandTable,
  type ObjectiveQuestion,
} from "@/lib/ielts/objective-scoring";

const questions: ObjectiveQuestion[] = [
  {
    id: "q1",
    type: "true-false-notgiven",
    prompt: "The sky is blue.",
    answers: ["True"],
  },
  {
    id: "q2",
    type: "multiple-choice",
    prompt: "Pick the fruit.",
    options: ["Carrot", "Apple", "Potato"],
    answers: ["Apple"],
  },
  {
    id: "q3",
    type: "short-answer",
    prompt: "Complete: natural ______.",
    answers: ["sponge", "sponges"],
  },
];

describe("isCorrect", () => {
  it("matches case-, space- and punctuation-insensitively", () => {
    expect(isCorrect(questions[0], "true")).toBe(true);
    expect(isCorrect(questions[0], "  TRUE. ")).toBe(true);
    expect(isCorrect(questions[0], "False")).toBe(false);
  });

  it("ignores a leading article", () => {
    expect(isCorrect(questions[2], "a sponge")).toBe(true);
    expect(isCorrect(questions[2], "the sponges")).toBe(true);
  });

  it("accepts any listed alternative", () => {
    expect(isCorrect(questions[2], "sponges")).toBe(true);
    expect(isCorrect(questions[2], "sponge")).toBe(true);
  });

  it("treats blank or missing answers as incorrect", () => {
    expect(isCorrect(questions[0], "")).toBe(false);
    expect(isCorrect(questions[0], "   ")).toBe(false);
    expect(isCorrect(questions[0], null)).toBe(false);
    expect(isCorrect(questions[0], undefined)).toBe(false);
  });
});

describe("optionsFor", () => {
  it("returns fixed options for True/False/Not Given", () => {
    expect(optionsFor(questions[0])).toEqual(["True", "False", "Not Given"]);
  });

  it("returns the question's own options for multiple choice", () => {
    expect(optionsFor(questions[1])).toEqual(["Carrot", "Apple", "Potato"]);
  });

  it("returns no options for short answer", () => {
    expect(optionsFor(questions[2])).toEqual([]);
  });
});

describe("gradeAnswers", () => {
  it("marks each question and totals the raw score", () => {
    const result = gradeAnswers(questions, { q1: "True", q2: "Potato", q3: "sponge" });
    expect(result.raw).toBe(2);
    expect(result.total).toBe(3);
    expect(result.perQuestion.map((q) => q.correct)).toEqual([true, false, true]);
  });

  it("records the canonical correct answer and the candidate's response", () => {
    const result = gradeAnswers(questions, { q2: "Potato" });
    const q2 = result.perQuestion.find((q) => q.id === "q2")!;
    expect(q2.correctAnswer).toBe("Apple");
    expect(q2.response).toBe("Potato");
    const q1 = result.perQuestion.find((q) => q.id === "q1")!;
    expect(q1.response).toBe(""); // unanswered
  });
});

describe("toPublicQuestion", () => {
  it("strips the answer key", () => {
    const pub = toPublicQuestion(questions[1]);
    expect(pub).not.toHaveProperty("answers");
    expect(pub.id).toBe("q2");
    expect(pub.options).toEqual(["Carrot", "Apple", "Potato"]);
  });
});

describe("rawToBand", () => {
  const table: BandTable = [
    [39, 9],
    [30, 7],
    [23, 6],
    [15, 5],
  ];

  it("scales a short paper to /40 before lookup", () => {
    // 10/10 scales to 40 → top band.
    expect(rawToBand(10, 10, table)).toBe(9);
  });

  it("maps a mid score to the right band", () => {
    // 6/10 → scaled 24 → band 6.
    expect(rawToBand(6, 10, table)).toBe(6);
  });

  it("returns 0 below the lowest threshold", () => {
    expect(rawToBand(1, 10, table)).toBe(0);
  });

  it("guards against an empty paper", () => {
    expect(rawToBand(0, 0, table)).toBe(0);
  });
});
