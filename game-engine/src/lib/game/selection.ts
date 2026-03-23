import type { Question } from "@/types/content";

export function shuffleQuestions<T>(items: T[], seed = Math.random()): T[] {
  const list = [...items];
  let state = Math.floor(seed * 2147483647) || 1;

  const next = () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }

  return list;
}

export function deriveQuestionSeed(questions: Question[]) {
  const source = questions.map((question) => question.id).join("|");
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % 2147483647;
  }

  return ((hash || 1) % 1000000) / 1000000;
}

export function selectChallengeQuestions(questions: Question[], count = 10, seed?: number): Question[] | null {
  const scoringQuestions = questions.filter((question) => question.mode === "score");
  if (scoringQuestions.length < count) {
    return null;
  }

  return shuffleQuestions(scoringQuestions, seed ?? deriveQuestionSeed(scoringQuestions)).slice(0, count);
}
