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

export function selectChallengeQuestions(questions: Question[], count = 10): Question[] | null {
  const scoringQuestions = questions.filter((question) => question.mode === "score");
  if (scoringQuestions.length < count) {
    return null;
  }

  return shuffleQuestions(scoringQuestions).slice(0, count);
}
