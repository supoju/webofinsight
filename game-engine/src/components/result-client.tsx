"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { parseMarkdownBlocks } from "@/lib/content/markdown";
import { buildShareCardSvg, buildShareText } from "@/lib/share/card";
import { readRecentResult, subscribeStorageChanges } from "@/lib/storage/local";
import type { QuestionCategory } from "@/types/content";
import type { ChallengeResult } from "@/types/game";

type MarkdownSection = {
  paragraphs: string[];
  list: string[];
  children: Record<string, MarkdownSection>;
};

function createSection(): MarkdownSection {
  return {
    paragraphs: [],
    list: [],
    children: {},
  };
}

function parseSections(markdown: string | null) {
  const sections: Record<string, MarkdownSection> = {};
  const nodes = parseMarkdownBlocks(markdown?.trim() ?? "");
  let currentSection: MarkdownSection | null = null;
  let currentChild: MarkdownSection | null = null;

  for (const node of nodes) {
    if (node.type === "heading" && node.level === 2) {
      currentSection = sections[node.text] ?? createSection();
      sections[node.text] = currentSection;
      currentChild = null;
      continue;
    }

    if (node.type === "heading" && node.level === 3 && currentSection) {
      currentChild = currentSection.children[node.text] ?? createSection();
      currentSection.children[node.text] = currentChild;
      continue;
    }

    const target = currentChild ?? currentSection;
    if (!target) {
      continue;
    }

    if (node.type === "paragraph") {
      target.paragraphs.push(node.text);
      continue;
    }

    if (node.type === "list") {
      target.list.push(...node.items);
    }
  }

  return sections;
}

function pickSummaryGuide(items: string[], score: number) {
  if (score >= 900) {
    return items.find((item) => item.startsWith("高分总结："))?.replace("高分总结：", "").trim();
  }

  if (score >= 500) {
    return items.find((item) => item.startsWith("中分总结："))?.replace("中分总结：", "").trim();
  }

  return items.find((item) => item.startsWith("低分总结："))?.replace("低分总结：", "").trim();
}

function pickLabeledItem(items: string[], label: string) {
  return items.find((item) => item.startsWith(`${label}：`))?.replace(`${label}：`, "").trim();
}

function mapCategoryToCopyKey(category: QuestionCategory | null) {
  switch (category) {
    case "length":
      return "length-illusion";
    case "size":
      return "size-illusion";
    case "parallel-direction":
      return "direction-illusion";
    case "color-brightness":
      return "color-brightness-illusion";
    case "ambiguous-image":
      return "ambiguous-image";
    default:
      return null;
  }
}

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function buildBehaviorProfile(result: ChallengeResult) {
  const timeoutCount = result.answers.filter((answer) => answer.wasTimeout).length;
  const accuracy = result.summary.accuracyRatio;
  const reaction = result.summary.averageReactionMs;

  if (accuracy >= 0.8 && reaction <= 2500) {
    return {
      label: "高压校准型",
      note: "你会先给直觉一点空间，但很快就能完成二次修正，时间压力没有把你彻底带偏。",
    };
  }

  if (timeoutCount >= 3) {
    return {
      label: "犹豫补偿型",
      note: "你知道第一眼不可信，所以会拖延确认；问题不是看不见，而是校准动作来得稍慢。",
    };
  }

  if (accuracy < 0.5 && reaction <= 2200) {
    return {
      label: "过度自信型",
      note: "你倾向于在证据还没稳定前就做判断，反应很快，但也更容易被上下文诱导。",
    };
  }

  return {
    label: "摇摆修正型",
    note: "你能意识到错觉存在，但会在直觉和修正之间来回拉扯，表现比第一眼更诚实。",
  };
}

function buildPressureTag(result: ChallengeResult) {
  const timeoutCount = result.answers.filter((answer) => answer.wasTimeout).length;

  if (timeoutCount >= 3) {
    return "时间压力会先击穿你的确认节奏";
  }

  if (result.summary.averageReactionMs <= 2200) {
    return "你更容易败给速度，而不是败给看不见";
  }

  return "你会先怀疑自己，所以后半程更容易稳住";
}

function buildReviewTone(result: ChallengeResult) {
  const wrongCount = result.answers.filter((answer) => !answer.wasCorrect).length;

  if (wrongCount === 0) {
    return "这一轮没有留下明显破绽，你不是没被诱导，而是能在误导成型前及时拉回判断。";
  }

  if (wrongCount <= 2) {
    return "你翻车不多，但每次翻车都发生在你最相信第一眼的时候。";
  }

  return "这些错题不是粗心，而是上下文比你更先说服了大脑。";
}

function buildPatternChips(result: ChallengeResult, behaviorLabel: string, pressureTag: string) {
  const chips = [behaviorLabel, pressureTag, result.summary.weakestCategoryLabel];
  if (result.summary.averageReactionMs <= 2000) {
    chips.push("高速度决策");
  } else if (result.summary.averageReactionMs >= 3500) {
    chips.push("慢校准风格");
  } else {
    chips.push("中段修正");
  }

  return chips;
}

export function ResultClient({
  resultsCopy,
  shareCopy,
}: {
  resultsCopy: string | null;
  shareCopy: string | null;
}) {
  const result = useSyncExternalStore(subscribeStorageChanges, readRecentResult, () => null);
  const [shareState, setShareState] = useState("");
  const resultSections = useMemo(() => parseSections(resultsCopy), [resultsCopy]);
  const shareSections = useMemo(() => parseSections(shareCopy), [shareCopy]);

  const shareText = useMemo(() => {
    if (!result) {
      return "";
    }

    return buildShareText(result.summary, shareCopy);
  }, [result, shareCopy]);

  async function copyShare() {
    if (!shareText) {
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setShareState("分享文案已复制");
  }

  function downloadShareCard() {
    if (!result) {
      return;
    }

    const svg = buildShareCardSvg(result.summary);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `optical-illusion-score-${result.summary.scoreTotal}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    setShareState("分享卡片已下载");
  }

  if (!result) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">还没有最近成绩</h1>
        <p className="max-w-xl text-slate-600 dark:text-slate-300">
          结果页依赖浏览器 localStorage 中的最近一次挑战结果。先去完成一局挑战。
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold !text-white dark:bg-cyan-300 dark:!text-slate-950"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const wrongAnswers = result.answers.filter((answer) => !answer.wasCorrect);
  const titleLead =
    resultSections["总标题"]?.paragraphs[0] ?? "你的眼睛没有输，只是大脑先一步替你做了决定。";
  const scoreGuide =
    pickSummaryGuide(resultSections["总结引导"]?.list ?? [], result.summary.scoreTotal) ??
    result.summary.tier.blurb;
  const weaknessCopyKey = mapCategoryToCopyKey(result.summary.weakestCategory);
  const weaknessInsight =
    (weaknessCopyKey
      ? resultSections["脆弱分类解读"]?.children[weaknessCopyKey]?.paragraphs[0]
      : null) ?? result.summary.personaSummary;
  const tierTone =
    pickLabeledItem(resultSections["人格化分析基调"]?.list ?? [], result.summary.tier.title) ??
    result.summary.tier.blurb;
  const reviewTitle =
    pickLabeledItem(resultSections["错题回顾引导"]?.list ?? [], "回顾标题") ?? "这些题，都是你第一眼最自信的时候翻的车。";
  const reviewLead =
    pickLabeledItem(resultSections["错题回顾引导"]?.list ?? [], "回顾说明") ??
    "重新看解释时，重点不是记答案，而是记住自己是被哪种线索骗走的。";
  const replayLabel =
    pickLabeledItem(resultSections["重开与分享"]?.list ?? [], "再来一局") ?? "再测一次";
  const shareLead =
    pickLabeledItem(resultSections["重开与分享"]?.list ?? [], "分享引导") ??
    "把你的称号和弱点类型发出去，看看谁更容易被第一眼骗倒。";
  const shareTags = shareSections["分享标签建议"]?.list ?? [];
  const accuracy = `${Math.round(result.summary.accuracyRatio * 100)}%`;
  const behavior = buildBehaviorProfile(result);
  const pressureTag = buildPressureTag(result);
  const chips = buildPatternChips(result, behavior.label, pressureTag);
  const reviewTone = buildReviewTone(result);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2.4rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_32%),linear-gradient(145deg,_rgba(255,255,255,0.98),_rgba(241,245,249,0.92))] shadow-[0_40px_120px_-55px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(145deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.92))]">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden p-8 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_transparent_0%,_transparent_48%,_rgba(15,23,42,0.04)_48.5%,_transparent_49%,_transparent_100%)] dark:bg-[linear-gradient(120deg,_transparent_0%,_transparent_48%,_rgba(148,163,184,0.08)_48.5%,_transparent_49%,_transparent_100%)]" />
            <div className="relative z-10">
              <p className="text-xs font-semibold tracking-[0.32em] text-slate-500 uppercase dark:text-slate-400">
                Optical Verdict
              </p>
              <div className="mt-6 flex flex-wrap items-end gap-4">
                <h1 className="text-[4.5rem] leading-none font-semibold tracking-[-0.06em] text-slate-950 sm:text-[6rem] dark:text-white">
                  {result.summary.scoreTotal}
                </h1>
                <div className="pb-2">
                  <p className="text-xs font-semibold tracking-[0.26em] text-slate-500 uppercase dark:text-slate-400">
                    Tier
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {result.summary.tier.title}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
                {titleLead}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[1.8rem] border border-slate-200/70 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/45">
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                    行为标签
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {behavior.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {behavior.note}
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-slate-200/70 bg-slate-950 p-5 text-slate-100 dark:border-slate-700 dark:bg-white">
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                    心理读数
                  </p>
                  <p className="mt-3 text-xl font-semibold tracking-tight text-white dark:text-slate-950">
                    {pressureTag}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300 dark:text-slate-600">
                    {scoreGuide}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-slate-600 uppercase dark:border-slate-700 dark:bg-slate-950/55 dark:text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/play"
                  className="inline-flex min-w-[9rem] items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold !text-white shadow-[0_18px_35px_-22px_rgba(15,23,42,0.9)] transition hover:bg-slate-800 dark:bg-cyan-300 dark:!text-slate-950 dark:hover:bg-cyan-200"
                >
                  {replayLabel}
                </Link>
                <button
                  type="button"
                  onClick={copyShare}
                  className="rounded-full border border-slate-300 bg-white/85 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  复制分享文案
                </button>
                <button
                  type="button"
                  onClick={downloadShareCard}
                  className="rounded-full border border-slate-300 bg-white/85 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  下载分享卡片
                </button>
              </div>

              {shareState ? <p className="mt-4 text-sm text-cyan-700 dark:text-cyan-300">{shareState}</p> : null}
            </div>
          </div>

          <div className="border-t border-slate-200/70 bg-[linear-gradient(180deg,_rgba(15,23,42,0.03),_rgba(15,23,42,0.07))] p-6 sm:p-8 lg:border-t-0 lg:border-l dark:border-slate-800 dark:bg-[linear-gradient(180deg,_rgba(148,163,184,0.06),_rgba(15,23,42,0.16))]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.7rem] border border-slate-200/70 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                  命中率
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {accuracy}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">10 题内你有多频繁压住第一眼直觉</p>
              </div>

              <div className="rounded-[1.7rem] border border-slate-200/70 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                  平均反应
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {result.summary.averageReactionMs}ms
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">越低代表你越快完成自我校准</p>
              </div>

              <div className="rounded-[1.7rem] border border-slate-200/70 bg-slate-950 p-5 text-white dark:border-slate-700 dark:bg-cyan-300 dark:text-slate-950">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-700">
                  最容易被骗
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {result.summary.weakestCategoryLabel}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300 dark:text-slate-800">{weaknessInsight}</p>
              </div>

              <div className="rounded-[1.7rem] border border-slate-200/70 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                  人格分析
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {result.summary.personaTitle}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{tierTone}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
                反转诊断
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {result.summary.personaTitle}
              </h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {formatDateTime(result.completedAt)}
            </div>
          </div>

          <p className="mt-5 text-sm leading-8 text-slate-700 dark:text-slate-300">{result.summary.personaSummary}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.7rem] bg-slate-100 p-5 dark:bg-slate-900">
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                为什么会翻车
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{weaknessInsight}</p>
            </div>
            <div className="rounded-[1.7rem] bg-slate-100 p-5 dark:bg-slate-900">
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                结果提示
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{reviewTone}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-950 text-slate-100 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.8)] dark:border-slate-700">
          <div className="border-b border-white/10 px-8 py-6">
            <p className="text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">Share Capsule</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">把这次翻车，变成一张能发出去的战报</h2>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-white/10 px-8 py-7 lg:border-r lg:border-b-0">
              <p className="text-sm leading-7 text-slate-300">{shareLead}</p>
              <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-white/5 p-5 text-sm leading-8 text-slate-100">
                {shareText}
              </div>
              {shareState ? <p className="mt-4 text-sm text-cyan-300">{shareState}</p> : null}
            </div>

            <div className="px-8 py-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">传播挂钩</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {shareTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-slate-200 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-[1.7rem] bg-[linear-gradient(135deg,_rgba(34,211,238,0.22),_rgba(15,23,42,0.2))] p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-cyan-100 uppercase">Social Trigger</p>
                <p className="mt-3 text-sm leading-7 text-slate-100">
                  用户更愿意转发“被看穿的弱点”而不是单纯高分。称号、弱点类型和平均反应时间，就是最容易引发比较和复测的三条钩子。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-950/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
              错题回顾
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {reviewTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{reviewLead}</p>
          </div>
          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-cyan-300 dark:text-slate-950">
            {wrongAnswers.length} 道错题
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {wrongAnswers.length === 0 ? (
            <div className="rounded-[1.8rem] border border-emerald-300/60 bg-emerald-50 p-6 text-sm leading-7 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-100">
              本局没有错题。你的第二眼比错觉更快。
            </div>
          ) : (
            wrongAnswers.map((answer, index) => (
              <article
                key={answer.questionId}
                className="grid gap-4 rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(241,245,249,0.75))] p-5 md:grid-cols-[auto_1fr] dark:border-slate-800 dark:bg-[linear-gradient(180deg,_rgba(15,23,42,0.78),_rgba(2,6,23,0.92))]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold tracking-[0.2em] text-white dark:bg-cyan-300 dark:text-slate-950">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                      {answer.title}
                    </h3>
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                      {answer.wasTimeout ? "超时失守" : "判断偏航"}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer.prompt}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-4 text-sm dark:bg-slate-950">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                        你的答案
                      </p>
                      <p className="mt-2 font-semibold text-slate-950 dark:text-white">
                        {answer.wasTimeout ? "超时" : answer.selectedLabel ?? "未作答"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4 text-sm dark:bg-slate-950">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                        正确答案
                      </p>
                      <p className="mt-2 font-semibold text-slate-950 dark:text-white">{answer.correctLabel}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{answer.explanation}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
