"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { MarkdownBlock } from "@/components/markdown-block";
import { MetricCard } from "@/components/metric-card";
import { buildShareCardSvg, buildShareText } from "@/lib/share/card";
import { readRecentResult, subscribeStorageChanges } from "@/lib/storage/local";

export function ResultClient({
  resultsCopy,
  shareCopy,
}: {
  resultsCopy: string | null;
  shareCopy: string | null;
}) {
  const result = useSyncExternalStore(subscribeStorageChanges, readRecentResult, () => null);
  const [shareState, setShareState] = useState("");

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
        <Link href="/" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white dark:bg-cyan-300 dark:text-slate-950">
          返回首页
        </Link>
      </div>
    );
  }

  const wrongAnswers = result.answers.filter((answer) => !answer.wasCorrect);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
            Challenge Result
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {result.summary.scoreTotal}
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
            {result.summary.tier.title}。{result.summary.tier.blurb}
          </p>
          <p className="mt-4 rounded-3xl bg-slate-100 px-5 py-4 text-sm leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {result.summary.personaSummary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/play" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white dark:bg-cyan-300 dark:text-slate-950">
              再来一局
            </Link>
            <button
              type="button"
              onClick={copyShare}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold dark:border-slate-700"
            >
              复制分享文案
            </button>
            <button
              type="button"
              onClick={downloadShareCard}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold dark:border-slate-700"
            >
              下载分享卡片
            </button>
          </div>
          {shareState ? <p className="mt-4 text-sm text-cyan-700 dark:text-cyan-300">{shareState}</p> : null}
        </div>

        <div className="grid gap-4">
          <MetricCard label="正确数" value={`${result.summary.correctCount} / ${result.summary.questionCount}`} />
          <MetricCard label="平均反应" value={`${result.summary.averageReactionMs}ms`} />
          <MetricCard label="最容易被骗" value={result.summary.weakestCategoryLabel} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
            结果页文案接口
          </p>
          <MarkdownBlock
            markdown={resultsCopy}
            fallback={`# 结果页内容未就绪\n\n- engine 已接好结果 copy 渲染入口\n- 当前使用运行时分析函数生成核心结论`}
          />
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
            分享文案接口
          </p>
          <MarkdownBlock
            markdown={shareCopy}
            fallback={`# 分享文案未就绪\n\n- 当前使用 engine 的动态结果文案\n- 不会改写 content-lab 最终语义，只在缺失时降级`}
          />
          <div className="mt-5 rounded-3xl bg-slate-100 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {shareText}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
              错题回顾
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              哪些题在第一眼骗过了你
            </h2>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm dark:bg-slate-900">
            {wrongAnswers.length} 道错题
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {wrongAnswers.length === 0 ? (
            <div className="rounded-3xl border border-emerald-300/60 bg-emerald-50 p-5 text-sm text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-100">
              本局没有错题。你的第二眼比错觉更快。
            </div>
          ) : (
            wrongAnswers.map((answer) => (
              <article
                key={answer.questionId}
                className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {answer.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer.prompt}</p>
                <div className="mt-4 grid gap-2 text-sm">
                  <p>
                    你的答案: <span className="font-semibold">{answer.wasTimeout ? "超时" : answer.selectedLabel ?? "未作答"}</span>
                  </p>
                  <p>
                    正确答案: <span className="font-semibold">{answer.correctLabel}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">{answer.explanation}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
