import { describe, expect, it } from "vitest";

import { renderShareTemplate } from "@/lib/share/template";
import type { ChallengeSummary } from "@/types/game";

const summary: ChallengeSummary = {
  scoreTotal: 880,
  maxScore: 1200,
  correctCount: 8,
  questionCount: 10,
  accuracyRatio: 0.8,
  averageReactionMs: 842,
  tier: {
    key: "visual-hunter",
    title: "视觉猎手",
    blurb: "blurb",
  },
  weakestCategory: "color-brightness",
  weakestCategoryLabel: "颜色明暗错觉",
  personaKey: "persona",
  personaTitle: "title",
  personaSummary: "summary",
};

describe("renderShareTemplate", () => {
  it("renders the first share template with frozen variables", () => {
    const markdown = `# 分享文案

## 短分享

我拿到 {{score}} 分，称号 {{tier}}，最容易被 {{weakestCategory}} 骗到，平均反应 {{averageReaction}}。
`;

    expect(renderShareTemplate(markdown, summary)).toBe(
      "我拿到 880 分，称号 视觉猎手，最容易被 颜色明暗错觉 骗到，平均反应 842ms。",
    );
  });

  it("returns null when the markdown does not contain a template line", () => {
    expect(renderShareTemplate("# title\n\n- no template", summary)).toBeNull();
  });
});
