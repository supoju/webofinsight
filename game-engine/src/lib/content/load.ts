import "server-only";

import { promises as fs } from "node:fs";

import { CONTENT_PATHS } from "@/lib/content/paths";
import { questionBankSchema } from "@/lib/content/schema";
import type {
  ContentBundle,
  ContentFileStatus,
  MarkdownCopyKey,
  Question,
} from "@/types/content";

async function safeReadFile(path: string) {
  try {
    const content = await fs.readFile(path, "utf8");
    return { state: "ready" as const, content };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown file system error";
    return { state: "missing" as const, detail };
  }
}

async function loadQuestionsFile(): Promise<{ questions: Question[]; status: ContentFileStatus }> {
  const file = await safeReadFile(CONTENT_PATHS.questions);
  if (file.state !== "ready") {
    return {
      questions: [],
      status: {
        key: "questions",
        path: CONTENT_PATHS.questions,
        state: "missing",
        detail: file.detail,
      },
    };
  }

  try {
    const parsed = JSON.parse(file.content);
    const questions = questionBankSchema.parse(parsed);
    return {
      questions,
      status: {
        key: "questions",
        path: CONTENT_PATHS.questions,
        state: "ready",
      },
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Invalid JSON";
    return {
      questions: [],
      status: {
        key: "questions",
        path: CONTENT_PATHS.questions,
        state: "invalid",
        detail,
      },
    };
  }
}

async function loadMarkdownFile(
  key: MarkdownCopyKey,
): Promise<{ value: string | null; status: ContentFileStatus }> {
  const file = await safeReadFile(CONTENT_PATHS[key]);
  if (file.state !== "ready") {
    return {
      value: null,
      status: {
        key,
        path: CONTENT_PATHS[key],
        state: "missing",
        detail: file.detail,
      },
    };
  }

  return {
    value: file.content,
    status: {
      key,
      path: CONTENT_PATHS[key],
      state: "ready",
    },
  };
}

export async function loadContentBundle(): Promise<ContentBundle> {
  const [questionsFile, home, results, share, pacing] = await Promise.all([
    loadQuestionsFile(),
    loadMarkdownFile("home"),
    loadMarkdownFile("results"),
    loadMarkdownFile("share"),
    loadMarkdownFile("pacing"),
  ]);

  return {
    questions: questionsFile.questions,
    copy: {
      home: home.value,
      results: results.value,
      share: share.value,
      pacing: pacing.value,
    },
    statuses: [
      questionsFile.status,
      home.status,
      results.status,
      share.status,
      pacing.status,
    ],
  };
}
