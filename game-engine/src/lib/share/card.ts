import type { ChallengeSummary } from "@/types/game";
import { renderShareTemplate } from "@/lib/share/template";

export function buildShareText(summary: ChallengeSummary, shareTemplateMarkdown: string | null) {
  const tierTitle = summary.tier.title;

  return (
    renderShareTemplate(shareTemplateMarkdown, summary) ??
    `我在 Optical Illusion Game 拿到 ${summary.scoreTotal} 分，称号是“${tierTitle}”，最容易被 ${summary.weakestCategoryLabel} 骗到。平均反应 ${summary.averageReactionMs}ms。你敢用第一眼来试吗？`
  );
}

export function buildShareCardSvg(summary: ChallengeSummary) {
  const escaped = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const escapedTierTitle = escaped(summary.tier.title);
  const escapedWeakestCategory = escaped(summary.weakestCategoryLabel);
  const escapedPersonaTitle = escaped(summary.personaTitle);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f3efe3" />
          <stop offset="100%" stop-color="#95b8f6" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" rx="36" fill="url(#bg)" />
      <rect x="40" y="40" width="1120" height="550" rx="30" fill="#0f172a" opacity="0.92" />
      <text x="90" y="130" fill="#d8f2ff" font-size="34" font-family="Verdana, sans-serif">Optical Illusion Game</text>
      <text x="90" y="250" fill="#ffffff" font-size="104" font-weight="700" font-family="Verdana, sans-serif">${summary.scoreTotal}</text>
      <text x="90" y="310" fill="#cbd5e1" font-size="30" font-family="Verdana, sans-serif">称号：${escapedTierTitle}</text>
      <text x="90" y="360" fill="#cbd5e1" font-size="30" font-family="Verdana, sans-serif">正确：${summary.correctCount} / ${summary.questionCount}</text>
      <text x="90" y="410" fill="#cbd5e1" font-size="30" font-family="Verdana, sans-serif">最容易被骗：${escapedWeakestCategory}</text>
      <text x="90" y="500" fill="#fef08a" font-size="28" font-family="Verdana, sans-serif">${escapedPersonaTitle}</text>
      <text x="90" y="548" fill="#e2e8f0" font-size="24" font-family="Verdana, sans-serif">第一眼会骗你，第二眼决定你是谁。</text>
    </svg>
  `.trim();
}
