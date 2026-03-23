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
  const escapedTierBlurb = escaped(summary.tier.blurb);
  const accuracy = Math.round(summary.accuracyRatio * 100);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="55%" stop-color="#e2e8f0" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
        <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#67e8f9" />
          <stop offset="100%" stop-color="#f8fafc" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" rx="36" fill="url(#bg)" />
      <circle cx="132" cy="102" r="210" fill="#67e8f9" opacity="0.16" />
      <circle cx="1108" cy="552" r="180" fill="#0f172a" opacity="0.08" />
      <rect x="34" y="34" width="1132" height="562" rx="34" fill="url(#panel)" />
      <rect x="58" y="58" width="724" height="514" rx="28" fill="#020617" stroke="rgba(255,255,255,0.08)" />
      <rect x="812" y="58" width="330" height="156" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <rect x="812" y="236" width="330" height="156" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <rect x="812" y="414" width="330" height="158" rx="28" fill="url(#accent)" opacity="0.96" />
      <text x="92" y="118" fill="#94a3b8" font-size="18" letter-spacing="6" font-family="Verdana, sans-serif">OPTICAL VERDICT</text>
      <text x="92" y="232" fill="#f8fafc" font-size="150" font-weight="700" font-family="Verdana, sans-serif">${summary.scoreTotal}</text>
      <text x="92" y="286" fill="#67e8f9" font-size="32" font-weight="700" font-family="Verdana, sans-serif">${escapedTierTitle}</text>
      <text x="92" y="338" fill="#e2e8f0" font-size="26" font-family="Verdana, sans-serif">命中率 ${accuracy}% / 正确 ${summary.correctCount} / ${summary.questionCount}</text>
      <text x="92" y="390" fill="#e2e8f0" font-size="26" font-family="Verdana, sans-serif">平均反应 ${summary.averageReactionMs}ms</text>
      <text x="92" y="452" fill="#f8fafc" font-size="42" font-weight="700" font-family="Verdana, sans-serif">最容易被骗：</text>
      <text x="92" y="500" fill="#fef08a" font-size="46" font-weight="700" font-family="Verdana, sans-serif">${escapedWeakestCategory}</text>
      <text x="92" y="548" fill="#cbd5e1" font-size="24" font-family="Verdana, sans-serif">${escapedPersonaTitle}</text>
      <text x="92" y="584" fill="#94a3b8" font-size="20" font-family="Verdana, sans-serif">第一眼会骗你，第二眼决定你是谁。</text>

      <text x="842" y="100" fill="#94a3b8" font-size="16" letter-spacing="4" font-family="Verdana, sans-serif">PATTERN</text>
      <text x="842" y="154" fill="#ffffff" font-size="36" font-weight="700" font-family="Verdana, sans-serif">${escapedPersonaTitle}</text>
      <text x="842" y="190" fill="#cbd5e1" font-size="19" font-family="Verdana, sans-serif">${escapedTierBlurb}</text>

      <text x="842" y="278" fill="#94a3b8" font-size="16" letter-spacing="4" font-family="Verdana, sans-serif">SOCIAL HOOK</text>
      <text x="842" y="330" fill="#ffffff" font-size="24" font-weight="700" font-family="Verdana, sans-serif">称号 + 弱点 + 速度</text>
      <text x="842" y="368" fill="#cbd5e1" font-size="19" font-family="Verdana, sans-serif">最容易引发比较和复测的三条线索</text>

      <text x="842" y="458" fill="#0f172a" font-size="16" letter-spacing="4" font-family="Verdana, sans-serif">SHARE</text>
      <text x="842" y="512" fill="#020617" font-size="30" font-weight="700" font-family="Verdana, sans-serif">我拿到 ${summary.scoreTotal} 分</text>
      <text x="842" y="552" fill="#0f172a" font-size="21" font-family="Verdana, sans-serif">称号 ${escapedTierTitle}</text>
      <text x="842" y="584" fill="#0f172a" font-size="21" font-family="Verdana, sans-serif">翻车点 ${escapedWeakestCategory}</text>
    </svg>
  `.trim();
}
