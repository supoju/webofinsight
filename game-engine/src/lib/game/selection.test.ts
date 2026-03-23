import { describe, expect, it } from "vitest";

import { selectChallengeQuestions } from "@/lib/game/selection";
import type { Question } from "@/types/content";

function buildQuestion(id: string, mode: "score" | "analysis"): Question {
  return {
    id,
    category: "length",
    mode,
    title: id,
    prompt: "prompt",
    assetType: "generator",
    generator: "MullerLyer",
    options: ["A", "B"],
    answer: 0,
    explanation: "explanation",
    difficulty: "easy",
    timeLimitSec: 5,
    score: 100,
    uiCopy: {
      intro: "intro",
      correct: "correct",
      wrong: "wrong",
    },
    psychologyGoal: "goal",
  };
}

describe("selectChallengeQuestions", () => {
  it("excludes analysis questions", () => {
    const questions = [
      ...Array.from({ length: 12 }, (_, index) => buildQuestion(`score-${index}`, "score")),
      ...Array.from({ length: 2 }, (_, index) => buildQuestion(`analysis-${index}`, "analysis")),
    ];

    const selected = selectChallengeQuestions(questions, 10);

    expect(selected).not.toBeNull();
    expect(selected?.every((question) => question.mode === "score")).toBe(true);
    expect(selected).toHaveLength(10);
  });

  it("returns null when there are not enough scoring questions", () => {
    const questions = Array.from({ length: 8 }, (_, index) => buildQuestion(`score-${index}`, "score"));
    expect(selectChallengeQuestions(questions, 10)).toBeNull();
  });
});
