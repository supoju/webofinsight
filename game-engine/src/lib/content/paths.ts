import { existsSync } from "node:fs";
import path from "node:path";

function hasQuestionsFile(root: string) {
  return existsSync(path.join(root, "data", "questions.json"));
}

export function resolveContentRoot() {
  const envRoot = process.env.CONTENT_ROOT
    ? path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.CONTENT_ROOT)
    : null;

  const candidates = [
    envRoot,
    path.join(process.cwd(), "content-lab"),
    path.join(process.cwd(), ".generated", "content-lab"),
    path.join(process.cwd(), "..", "content-lab"),
    path.join(process.cwd(), "game-engine", ".generated", "content-lab"),
    path.join(process.cwd(), "..", "game-engine", ".generated", "content-lab"),
  ].filter((value): value is string => Boolean(value));

  const matched = candidates.find(hasQuestionsFile);
  return matched ?? candidates[0] ?? path.join(process.cwd(), "..", "content-lab");
}

export const CONTENT_ROOT = resolveContentRoot();

export const CONTENT_PATHS = {
  questions: path.join(CONTENT_ROOT, "data", "questions.json"),
  home: path.join(CONTENT_ROOT, "copy", "home.md"),
  results: path.join(CONTENT_ROOT, "copy", "results.md"),
  share: path.join(CONTENT_ROOT, "copy", "share.md"),
  pacing: path.join(CONTENT_ROOT, "pacing", "sequence.md"),
} as const;
