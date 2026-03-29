import { describe, expect, it } from "vitest";

import { questionBankSchema } from "@/lib/content/schema";

function buildQuestion(id: string, mode: "score" | "analysis") {
  return {
    id,
    category: "length" as const,
    mode,
    title: id,
    prompt: "prompt",
    assetType: "generator" as const,
    generator: "MullerLyer",
    options: ["Same", "Different"],
    answer: 0,
    explanation: "explanation",
    difficulty: "easy" as const,
    timeLimitSec: 5,
    score: mode === "score" ? 100 : 0,
    uiCopy: {
      intro: "intro",
      correct: "correct",
      wrong: "wrong",
    },
    psychologyGoal: "goal",
  };
}

describe("questionBankSchema", () => {
  it("accepts the expanded bank with 80 score questions and 4 analysis questions", () => {
    const questions = [
      ...Array.from({ length: 80 }, (_, index) => buildQuestion(`score-${index}`, "score")),
      ...Array.from({ length: 4 }, (_, index) => buildQuestion(`analysis-${index}`, "analysis")),
    ];

    expect(() => questionBankSchema.parse(questions)).not.toThrow();
  });

  it("preserves authored generator variants on parsed questions", () => {
    const questions = [
      ...Array.from({ length: 80 }, (_, index) => ({
        ...buildQuestion(`score-${index}`, "score"),
        renderVariant: index === 0 ? "tight-outward" : undefined,
      })),
      ...Array.from({ length: 4 }, (_, index) => buildQuestion(`analysis-${index}`, "analysis")),
    ];

    const parsed = questionBankSchema.parse(questions);

    expect(parsed[0]).toMatchObject({
      generator: "MullerLyer",
      renderVariant: "tight-outward",
    });
  });

  it("rejects banks that do not provide 80 score questions", () => {
    const questions = [
      ...Array.from({ length: 79 }, (_, index) => buildQuestion(`score-${index}`, "score")),
      ...Array.from({ length: 5 }, (_, index) => buildQuestion(`analysis-${index}`, "analysis")),
    ];

    expect(() => questionBankSchema.parse(questions)).toThrow(/80 standard scoring questions/i);
  });
});
