import type { ChallengeSummary } from "@/types/game";

const TEMPLATE_TOKENS = [
  "{{score}}",
  "{{tier}}",
  "{{weakestCategory}}",
  "{{averageReaction}}",
] as const;

function extractShareTemplate(markdown: string | null) {
  if (!markdown?.trim()) {
    return null;
  }

  const lines = markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#") && !line.startsWith("- "));

  return lines.find((line) => TEMPLATE_TOKENS.some((token) => line.includes(token))) ?? null;
}

function formatAverageReaction(averageReactionMs: number) {
  if (averageReactionMs >= 1000) {
    return `${(averageReactionMs / 1000).toFixed(2)}s`;
  }

  return `${averageReactionMs}ms`;
}

export function renderShareTemplate(templateMarkdown: string | null, summary: ChallengeSummary) {
  const template = extractShareTemplate(templateMarkdown);

  if (!template) {
    return null;
  }

  return template
    .replaceAll("{{score}}", String(summary.scoreTotal))
    .replaceAll("{{tier}}", summary.tier.title)
    .replaceAll("{{weakestCategory}}", summary.weakestCategoryLabel)
    .replaceAll("{{averageReaction}}", formatAverageReaction(summary.averageReactionMs));
}
