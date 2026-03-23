import { describe, expect, it } from "vitest";

import { buildResult, calculateQuestionScore, findWeakestCategory, mapScoreToTier } from "@/lib/game/scoring";
import type { Question } from "@/types/content";
import type { AnswerRecord } from "@/types/game";

const question: Question = {
  id: "q-1",
  category: "length",
  mode: "score",
  title: "test",
  prompt: "prompt",
  assetType: "generator",
  generator: "MullerLyer",
  options: ["same", "different"],
  answer: 0,
  explanation: "explanation",
  difficulty: "medium",
  timeLimitSec: 5,
  score: 100,
  uiCopy: {
    intro: "intro",
    correct: "correct",
    wrong: "wrong",
  },
  psychologyGoal: "goal",
};

const baseRecord: AnswerRecord = {
  questionId: "q-1",
  title: "test",
  prompt: "prompt",
  category: "length",
  selectedIndex: 0,
  selectedLabel: "same",
  correctIndex: 0,
  correctLabel: "same",
  wasCorrect: true,
  wasTimeout: false,
  reactionMs: 1000,
  awardedScore: 150,
  explanation: "explanation",
  uiCopy: question.uiCopy,
};

describe("scoring", () => {
  it("awards more points to faster correct answers", () => {
    const fast = calculateQuestionScore(question, 800, true);
    const slow = calculateQuestionScore(question, 4200, true);
    const wrong = calculateQuestionScore(question, 1500, false);

    expect(fast).toBeGreaterThan(slow);
    expect(wrong).toBe(0);
  });

  it("detects weakest category from wrong answers", () => {
    const weakest = findWeakestCategory([
      { ...baseRecord, category: "length", wasCorrect: false },
      { ...baseRecord, questionId: "q-2", category: "length", wasCorrect: false },
      { ...baseRecord, questionId: "q-3", category: "size", wasCorrect: false },
    ]);

    expect(weakest).toBe("length");
  });

  it("maps high scores to stronger tiers", () => {
    expect(mapScoreToTier(95, 100).title).toBe("人类校准器");
    expect(mapScoreToTier(20, 100).title).toBe("视觉实习生");
  });

  it("builds a serializable result summary", () => {
    const result = buildResult([baseRecord, { ...baseRecord, questionId: "q-2", wasCorrect: false, awardedScore: 0 }]);
    expect(result.summary.questionCount).toBe(2);
    expect(result.summary.correctCount).toBe(1);
  });
});
