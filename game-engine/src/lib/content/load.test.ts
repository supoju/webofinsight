import { afterEach, describe, expect, it, vi } from "vitest";

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

const generatedQuestions = [
  ...Array.from({ length: 80 }, (_, index) => buildQuestion(`score-${index}`, "score")),
  ...Array.from({ length: 4 }, (_, index) => buildQuestion(`analysis-${index}`, "analysis")),
];

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("loadContentBundle", () => {
  it("prefers generated content when present", async () => {
    vi.doMock("server-only", () => ({}));

    vi.doMock("@/lib/content/generated", () => ({
      GENERATED_CONTENT: {
        questions: generatedQuestions,
        copy: {
          home: "# home",
          results: "# results",
          share: "# share",
          pacing: "# pacing",
        },
        sourceRoot: ".generated/content-lab",
      },
    }));

    vi.doMock("node:fs", async (importOriginal) => {
      const actual = await importOriginal<typeof import("node:fs")>();
      return {
        ...actual,
        promises: {
          ...actual.promises,
          readFile: vi.fn().mockRejectedValue(new Error("fs unavailable in worker")),
        },
      };
    });

    const { loadContentBundle } = await import("@/lib/content/load");
    const bundle = await loadContentBundle();

    expect(bundle.questions).toHaveLength(84);
    expect(bundle.copy.home).toBe("# home");
    expect(bundle.statuses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "questions",
          state: "ready",
          path: ".generated/content-lab/data/questions.json",
        }),
        expect.objectContaining({
          key: "home",
          state: "ready",
          path: ".generated/content-lab/copy/home.md",
        }),
      ]),
    );
  });
});
