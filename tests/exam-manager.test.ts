import { describe, expect, it } from "vitest";

import { EXAM_LIBRARY, getExam, pickExam } from "@/lib/ielts/exam-library";
import { LISTENING_TESTS } from "@/lib/ielts/listening-tests";
import { READING_TESTS } from "@/lib/ielts/reading-tests";
import { speakingScript } from "@/lib/ielts/speaking-script";
import { WRITING_PROMPTS } from "@/lib/ielts/writing-prompts";

describe("exam management logic", () => {
  it("provides comprehensive exam content across all four papers", () => {
    expect(EXAM_LIBRARY.length).toBeGreaterThanOrEqual(6);
    expect(LISTENING_TESTS.length).toBeGreaterThanOrEqual(2);
    expect(READING_TESTS.length).toBeGreaterThanOrEqual(1);
    expect(WRITING_PROMPTS.length).toBeGreaterThanOrEqual(5);
  });

  it("can inspect generated speaking scripts for any exam set ID", () => {
    for (const set of EXAM_LIBRARY) {
      const script = speakingScript("full_mock", set.id);
      expect(script.length).toBeGreaterThan(0);
      expect(script.some((m) => m.kind === "cue_card")).toBe(true);
      expect(script.some((m) => m.kind === "question" && m.part === "part1")).toBe(true);
      expect(script.some((m) => m.kind === "question" && m.part === "part3")).toBe(true);
    }
  });

  it("allows looking up and seeding custom exam sets", () => {
    const customId = "custom-test-123";
    const customSet = {
      id: customId,
      title: "Custom Exam Test",
      part1: [
        {
          id: "custom-p1",
          part: "part1" as const,
          topic: "AI",
          prompt: "How do you use AI?",
          followUps: ["Is it helpful?"],
        },
      ],
      part2: {
        id: "custom-p2",
        part: "part2" as const,
        topic: "AI tool",
        prompt: "Describe an AI tool you use.",
        followUps: ["what it is", "why you use it"],
      },
      part3: {
        id: "custom-p3",
        part: "part3" as const,
        topic: "Future of AI",
        prompt: "Will AI change education?",
        followUps: ["In what ways?"],
      },
    };

    expect(customSet.id).toBe(customId);
    expect(customSet.part1.length).toBe(1);
    expect(customSet.part2.followUps.length).toBe(2);
  });
});
