export type QuestionCategory =
  | "length"
  | "size"
  | "parallel-direction"
  | "color-brightness"
  | "ambiguous-image";

export type QuestionMode = "score" | "analysis";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionUiCopy = {
  intro: string;
  correct: string;
  wrong: string;
  timeout?: string;
};

export type Question = {
  id: string;
  category: QuestionCategory;
  mode: QuestionMode;
  title: string;
  prompt: string;
  assetType: "generator" | "asset";
  generator?: string;
  asset?: string;
  renderVariant?: string;
  options: string[];
  answer: number | string;
  explanation: string;
  difficulty: QuestionDifficulty;
  timeLimitSec: number;
  score: number;
  uiCopy: QuestionUiCopy;
  psychologyGoal: string;
};

export type MarkdownCopyKey = "home" | "results" | "share" | "pacing";
export type FileLoadState = "ready" | "missing" | "invalid";

export type ContentFileStatus = {
  key: string;
  path: string;
  state: FileLoadState;
  detail?: string;
};

export type ContentBundle = {
  questions: Question[];
  copy: Record<MarkdownCopyKey, string | null>;
  statuses: ContentFileStatus[];
};
