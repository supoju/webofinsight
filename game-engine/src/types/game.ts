import type { Question, QuestionCategory } from "@/types/content";

export type TierKey =
  | "visual-intern"
  | "illusion-survivor"
  | "observation-ace"
  | "visual-hunter"
  | "human-calibrator";

export type Tier = {
  key: TierKey;
  title: string;
  blurb: string;
};

export type AnswerRecord = {
  questionId: string;
  title: string;
  prompt: string;
  category: QuestionCategory;
  selectedIndex: number | null;
  selectedLabel: string | null;
  correctIndex: number;
  correctLabel: string;
  wasCorrect: boolean;
  wasTimeout: boolean;
  reactionMs: number;
  awardedScore: number;
  explanation: string;
  uiCopy: Question["uiCopy"];
};

export type ChallengeSummary = {
  scoreTotal: number;
  maxScore: number;
  correctCount: number;
  questionCount: number;
  accuracyRatio: number;
  averageReactionMs: number;
  tier: Tier;
  weakestCategory: QuestionCategory | null;
  weakestCategoryLabel: string;
  personaKey: string;
  personaTitle: string;
  personaSummary: string;
};

export type ChallengeResult = {
  completedAt: string;
  answers: AnswerRecord[];
  summary: ChallengeSummary;
};
