import { CATEGORY_LABELS } from "@/lib/game/categories";
import type { Question, QuestionCategory } from "@/types/content";
import type { AnswerRecord, ChallengeResult, ChallengeSummary, Tier, TierKey } from "@/types/game";

const difficultyMultiplier: Record<Question["difficulty"], number> = {
  easy: 1,
  medium: 1.25,
  hard: 1.5,
};

const tiers: Array<{ minRatio: number; tier: Tier }> = [
  {
    minRatio: 0.9,
    tier: {
      key: "human-calibrator",
      title: "人类校准器",
      blurb: "大脑会被诱导，但你恢复校准的速度极快。",
    },
  },
  {
    minRatio: 0.75,
    tier: {
      key: "visual-hunter",
      title: "视觉猎手",
      blurb: "你已经习惯在第一眼之外继续追踪真实结构。",
    },
  },
  {
    minRatio: 0.55,
    tier: {
      key: "observation-ace",
      title: "观察高手",
      blurb: "你会被骗，但通常能在第二眼里抓回主动权。",
    },
  },
  {
    minRatio: 0.35,
    tier: {
      key: "illusion-survivor",
      title: "错觉幸存者",
      blurb: "你撑过了大部分反转，说明直觉已经开始升级。",
    },
  },
  {
    minRatio: 0,
    tier: {
      key: "visual-intern",
      title: "视觉实习生",
      blurb: "第一眼经常先赢，但真相还在等你追上来。",
    },
  },
];

const personaLookup: Record<TierKey, string> = {
  "human-calibrator": "你不急着相信第一眼，擅长把直觉和结构重新对齐。",
  "visual-hunter": "你对异常变化很敏感，越到后段越能压住错觉带来的误导。",
  "observation-ace": "你的判断稳定，但在强上下文诱导下仍会被短暂带偏。",
  "illusion-survivor": "你知道自己会被误导，因此更依赖第二次确认。",
  "visual-intern": "你拥有最真实的第一反应，也最容易被经典错觉正面命中。",
};

export function normalizeAnswerIndex(question: Question): number {
  if (typeof question.answer === "number") {
    return question.answer;
  }

  return question.options.findIndex((option) => option === question.answer);
}

export function calculateQuestionScore(question: Question, reactionMs: number, isCorrect: boolean) {
  if (!isCorrect) {
    return 0;
  }

  const base = question.score * difficultyMultiplier[question.difficulty];
  const maxMs = question.timeLimitSec * 1000;
  const speedRatio = Math.max(0, Math.min(1, (maxMs - reactionMs) / maxMs));
  const speedBonus = Math.round(question.score * 0.35 * speedRatio);

  return Math.round(base + speedBonus);
}

export function mapScoreToTier(scoreTotal: number, maxScore: number): Tier {
  const ratio = maxScore === 0 ? 0 : scoreTotal / maxScore;
  const match = tiers.find((item) => ratio >= item.minRatio);
  return match ? match.tier : tiers[tiers.length - 1].tier;
}

export function findWeakestCategory(records: AnswerRecord[]): QuestionCategory | null {
  if (records.length === 0) {
    return null;
  }

  const wrongCounts = new Map<QuestionCategory, number>();
  for (const record of records) {
    if (!record.wasCorrect) {
      wrongCounts.set(record.category, (wrongCounts.get(record.category) ?? 0) + 1);
    }
  }

  if (wrongCounts.size === 0) {
    const slowest = [...records].sort((left, right) => right.reactionMs - left.reactionMs)[0];
    return slowest?.category ?? null;
  }

  return [...wrongCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

export function buildPersona(
  tier: Tier,
  weakestCategory: QuestionCategory | null,
): Pick<ChallengeSummary, "personaKey" | "personaTitle" | "personaSummary"> {
  const weakestLabel = weakestCategory ? CATEGORY_LABELS[weakestCategory] : "全类型";
  const personaKey = `${tier.key}:${weakestCategory ?? "balanced"}`;

  return {
    personaKey,
    personaTitle: `${tier.title} / ${weakestLabel}`,
    personaSummary: `${personaLookup[tier.key]} 你最容易在${weakestLabel}里被“第一眼答案”抢跑。`,
  };
}

export function summarizeRun(records: AnswerRecord[]): ChallengeSummary {
  const scoreTotal = records.reduce((sum, record) => sum + record.awardedScore, 0);
  const questionCount = records.length;
  const correctCount = records.filter((record) => record.wasCorrect).length;
  const averageReactionMs =
    questionCount === 0
      ? 0
      : Math.round(records.reduce((sum, record) => sum + record.reactionMs, 0) / questionCount);
  const theoreticalMax = Math.max(questionCount * 170, 1);
  const tier = mapScoreToTier(scoreTotal, theoreticalMax);
  const weakestCategory = findWeakestCategory(records);
  const weakestCategoryLabel = weakestCategory ? CATEGORY_LABELS[weakestCategory] : "暂无明显弱点";
  const persona = buildPersona(tier, weakestCategory);

  return {
    scoreTotal,
    maxScore: theoreticalMax,
    correctCount,
    questionCount,
    accuracyRatio: questionCount === 0 ? 0 : correctCount / questionCount,
    averageReactionMs,
    tier,
    weakestCategory,
    weakestCategoryLabel,
    personaKey: persona.personaKey,
    personaTitle: persona.personaTitle,
    personaSummary: persona.personaSummary,
  };
}

export function buildResult(records: AnswerRecord[]): ChallengeResult {
  return {
    completedAt: new Date().toISOString(),
    answers: records,
    summary: summarizeRun(records),
  };
}
