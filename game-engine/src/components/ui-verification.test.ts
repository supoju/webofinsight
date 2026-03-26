// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GameClient } from "@/components/game-client";
import { HomeClient } from "@/components/home-client";
import { ResultClient } from "@/components/result-client";
import { ThemeProvider } from "@/components/theme-provider";
import type { ContentFileStatus, Question } from "@/types/content";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
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

function buildStatuses(state: "ready" | "missing" = "ready"): ContentFileStatus[] {
  return [
    { key: "questions", path: "content-lab/data/questions.json", state },
    { key: "home", path: "content-lab/copy/home.md", state: "ready" },
    { key: "results", path: "content-lab/copy/results.md", state: "ready" },
    { key: "share", path: "content-lab/copy/share.md", state: "ready" },
    { key: "pacing", path: "content-lab/pacing/sequence.md", state: "ready" },
  ];
}

function buildQuestion(index: number): Question {
  return {
    id: `q-${index}`,
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

describe("ui verification", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.dataset.theme = "";
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("cycles theme modes and applies dark mode to the document", async () => {
    const view = render(
      React.createElement(ThemeProvider, {
        children: React.createElement("div", null, "content"),
      }),
    );

    expect(document.documentElement.dataset.theme).toBe("system");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(view.getByRole("button"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(view.getByRole("button"));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("renders mobile-first responsive wrappers on home, play, and result views", () => {
    const home = render(
      React.createElement(HomeClient, {
        homeCopy: null,
        pacingCopy: null,
        statuses: buildStatuses(),
        canStart: true,
      }),
    );
    expect(home.container.firstElementChild?.className).toContain("px-4 py-8 sm:px-6 lg:px-8");
    home.unmount();

    const game = render(
      React.createElement(GameClient, {
        questions: Array.from({ length: 10 }, (_, index) => buildQuestion(index + 1)),
      }),
    );
    expect(game.container.firstElementChild?.className).toContain("max-w-4xl");
    expect(game.container.firstElementChild?.className).toContain("px-4 py-5 sm:px-6 sm:py-6 lg:px-8");
    game.unmount();

    window.localStorage.removeItem("optical-illusion-game:recent-result");
    const result = render(
      React.createElement(ResultClient, {
        resultsCopy: null,
        shareCopy: null,
      }),
    );
    expect(result.container.firstElementChild?.className).toContain("px-4 text-center");
  });

  it("shows graceful fallback states when content or result data is unavailable", () => {
    const home = render(
      React.createElement(HomeClient, {
        homeCopy: null,
        pacingCopy: null,
        statuses: buildStatuses("missing"),
        canStart: false,
      }),
    );
    expect(home.container.querySelector('section#content-missing')).not.toBeNull();
    expect(home.container.querySelector('a[href="#content-missing"]')).not.toBeNull();
    home.unmount();

    const game = render(
      React.createElement(GameClient, {
        questions: Array.from({ length: 9 }, (_, index) => buildQuestion(index + 1)),
      }),
    );
    expect(game.container.querySelector('a[href="/"]')).not.toBeNull();
    expect(game.container.textContent).toContain("content-lab/data/questions.json");
    game.unmount();

    window.localStorage.removeItem("optical-illusion-game:recent-result");
    const result = render(
      React.createElement(ResultClient, {
        resultsCopy: null,
        shareCopy: null,
      }),
    );
    expect(result.container.querySelector('a[href="/"]')).not.toBeNull();
  });

  it("keeps the illusion stage directly ahead of the answer controls in the play flow", () => {
    const game = render(
      React.createElement(GameClient, {
        questions: Array.from({ length: 10 }, (_, index) => buildQuestion(index + 1)),
      }),
    );

    const stageRegion = screen.getByRole("region", { name: "Illusion stage" });
    const answerRegion = screen.getByRole("region", { name: "Answer controls" });
    const stageShell = screen.getByTestId("stage-shell");

    expect(stageRegion.compareDocumentPosition(answerRegion) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(answerRegion.textContent).toContain("Prompt 1");
    expect(answerRegion.textContent).toContain("Correct");
    expect(answerRegion.textContent).toContain("Wrong");
    expect(game.container.firstElementChild?.className).toContain("max-w-4xl");
    expect(stageShell.className).toContain("max-w-2xl");
  });

  it("uses the shared card and token system on home and result hero sections", () => {
    const home = render(
      React.createElement(HomeClient, {
        homeCopy: null,
        pacingCopy: null,
        statuses: buildStatuses(),
        canStart: true,
      }),
    );
    expect(screen.getByTestId("home-hero").className).toContain("bg-card");
    home.unmount();

    window.localStorage.setItem(
      "optical-illusion-game:recent-result",
      JSON.stringify({
        completedAt: new Date("2026-03-26T12:00:00.000Z").toISOString(),
        summary: {
          scoreTotal: 780,
          correctCount: 7,
          questionCount: 10,
          accuracyRatio: 0.7,
          averageReactionMs: 2310,
          weakestCategory: "length",
          weakestCategoryLabel: "长度错觉",
          tier: {
            title: "校准中段",
            blurb: "你会被第一眼影响，但还能逐步拉回判断。",
          },
          personaTitle: "第二眼接管者",
          personaSummary: "你不是看不到，而是需要多半秒来压住第一眼。",
        },
        answers: [],
      }),
    );

    const result = render(
      React.createElement(ResultClient, {
        resultsCopy: null,
        shareCopy: null,
      }),
    );
    expect(screen.getByTestId("result-hero").className).toContain("border-border/80");
    result.unmount();
  });

  it("uses the shared display typography on key page titles", () => {
    const home = render(
      React.createElement(HomeClient, {
        homeCopy: null,
        pacingCopy: null,
        statuses: buildStatuses(),
        canStart: true,
      }),
    );
    expect(screen.getByRole("heading", { name: "第一眼越自信，反转就越疼。" }).className).toContain("font-display");
    home.unmount();

    window.localStorage.setItem(
      "optical-illusion-game:recent-result",
      JSON.stringify({
        completedAt: new Date("2026-03-26T12:00:00.000Z").toISOString(),
        summary: {
          scoreTotal: 780,
          correctCount: 7,
          questionCount: 10,
          accuracyRatio: 0.7,
          averageReactionMs: 2310,
          weakestCategory: "length",
          weakestCategoryLabel: "长度错觉",
          tier: {
            title: "校准中段",
            blurb: "你会被第一眼影响，但还能逐步拉回判断。",
          },
          personaTitle: "第二眼接管者",
          personaSummary: "你不是看不到，而是需要多半秒来压住第一眼。",
        },
        answers: [],
      }),
    );

    const result = render(
      React.createElement(ResultClient, {
        resultsCopy: null,
        shareCopy: null,
      }),
    );
    expect(screen.getByRole("heading", { name: "780" }).className).toContain("font-display");
    result.unmount();
  });
});
