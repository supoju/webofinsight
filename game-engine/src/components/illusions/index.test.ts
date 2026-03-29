// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { IllusionStage } from "@/components/illusions";
import type { Question } from "@/types/content";

function buildQuestion(variant: string): Question {
  const question: Question = {
    id: `delboeuf-${variant}`,
    category: "size",
    mode: "score",
    title: "Delboeuf variant",
    prompt: "Which center circle is larger?",
    assetType: "generator",
    generator: "Delboeuf",
    options: ["Left", "Right", "Same"],
    answer: "Same",
    explanation: "Context changes perceived size.",
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

  (question as Question & { renderVariant?: string }).renderVariant = variant;

  return question;
}

describe("IllusionStage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders distinct Delboeuf ring sizes for different authored variants", () => {
    const wide = render(React.createElement(IllusionStage, { question: buildQuestion("wide-gap") }));
    const wideOuterRing = wide.container.querySelector('circle[cx="285"][fill="none"]');
    const wideRadius = wideOuterRing?.getAttribute("r");
    wide.unmount();

    const tight = render(React.createElement(IllusionStage, { question: buildQuestion("tight-gap") }));
    const tightOuterRing = tight.container.querySelector('circle[cx="285"][fill="none"]');
    const tightRadius = tightOuterRing?.getAttribute("r");

    expect(wideRadius).not.toBe(tightRadius);
  });
});
