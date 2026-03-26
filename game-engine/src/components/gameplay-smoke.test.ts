// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GameClient } from "@/components/game-client";
import { HomeClient } from "@/components/home-client";
import { ResultClient } from "@/components/result-client";
import { readRecentResult } from "@/lib/storage/local";
import type { ContentFileStatus, Question } from "@/types/content";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { ...props, href }, children),
}));

vi.mock("@/components/illusions", () => ({
  IllusionStage: ({ question }: { question: Question }) =>
    React.createElement("div", { "data-testid": "illusion-stage" }, question.id),
}));

function buildQuestion(index: number): Question {
  return {
    id: `q-${String(index).padStart(2, "0")}`,
    category: "length",
    mode: "score",
    title: `Question ${index}`,
    prompt: `Prompt ${index}`,
    assetType: "generator",
    generator: "MullerLyer",
    options: ["Correct", "Wrong"],
    answer: "Correct",
    explanation: `Explanation ${index}`,
    difficulty: "easy",
    timeLimitSec: 5,
    score: 100,
    uiCopy: {
      intro: `Intro ${index}`,
      correct: `Correct ${index}`,
      wrong: `Wrong ${index}`,
    },
    psychologyGoal: `Goal ${index}`,
  };
}

function buildStatuses(): ContentFileStatus[] {
  return [
    { key: "questions", path: "content-lab/data/questions.json", state: "ready" },
    { key: "home", path: "content-lab/copy/home.md", state: "ready" },
    { key: "results", path: "content-lab/copy/results.md", state: "ready" },
    { key: "share", path: "content-lab/copy/share.md", state: "ready" },
    { key: "pacing", path: "content-lab/pacing/sequence.md", state: "ready" },
  ];
}

describe("gameplay smoke flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    pushMock.mockReset();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("covers home to play to result with persisted run data", async () => {
    const questions = Array.from({ length: 10 }, (_, index) => buildQuestion(index + 1));
    const statuses = buildStatuses();

    const home = render(
      React.createElement(HomeClient, {
        homeCopy: null,
        pacingCopy: null,
        statuses,
        canStart: true,
      }),
    );

    const startLink = home.container.querySelector('a[href="/play"]');
    expect(startLink).not.toBeNull();

    home.unmount();

    const game = render(React.createElement(GameClient, { questions }));

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Correct" }));
      await vi.advanceTimersByTimeAsync(700);
    }

    expect(pushMock).toHaveBeenCalledWith("/result");

    const storedResult = readRecentResult();
    expect(storedResult).not.toBeNull();
    expect(storedResult?.summary.questionCount).toBe(10);
    expect(storedResult?.summary.correctCount).toBe(10);

    game.unmount();

    const result = render(
      React.createElement(ResultClient, {
        resultsCopy: null,
        shareCopy: null,
      }),
    );

    expect(screen.getByText(String(storedResult?.summary.scoreTotal))).toBeTruthy();
    expect(result.container.querySelector('a[href="/play"]')).not.toBeNull();
  });
});
