"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { ContentStatus } from "@/components/content-status";
import { MetricCard } from "@/components/metric-card";
import { readBestScore, readRecentResult, subscribeStorageChanges } from "@/lib/storage/local";
import type { ContentFileStatus } from "@/types/content";

export function HomeClient({
  statuses,
  canStart,
}: {
  homeCopy: string | null;
  pacingCopy: string | null;
  statuses: ContentFileStatus[];
  canStart: boolean;
}) {
  const bestScore = useSyncExternalStore(subscribeStorageChanges, readBestScore, () => null);
  const recentResult = useSyncExternalStore(subscribeStorageChanges, readRecentResult, () => null);
  const invalidStatuses = statuses.filter((status) => status.state !== "ready");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_35px_80px_-50px_rgba(15,23,42,0.55)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div className="inline-flex rounded-full border border-cyan-300/60 bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-cyan-900 uppercase dark:border-cyan-400/30 dark:bg-cyan-950/30 dark:text-cyan-100">
            Optical Illusion Game
          </div>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            第一眼越自信，反转就越疼。
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            10 题快节奏视觉错觉挑战。每题只有 5 秒，你要在视觉直觉和真实结构之间抢回控制权。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={canStart ? "/play" : "#content-missing"}
              className={`inline-flex min-w-[12rem] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition ${
                canStart
                  ? "bg-slate-950 !text-white shadow-[0_18px_35px_-22px_rgba(15,23,42,0.9)] hover:bg-slate-800 dark:bg-cyan-300 dark:!text-slate-950 dark:hover:bg-cyan-200"
                  : "cursor-not-allowed bg-slate-300 !text-slate-700 dark:bg-slate-800 dark:!text-slate-300"
              }`}
            >
              开始 10 题挑战
            </Link>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {canStart
                ? "10 题随机挑战已就绪，连续反转从第一眼开始。"
                : "题库仍有校验问题，修复后即可开启挑战。"}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <MetricCard label="最高分" value={bestScore === null ? "--" : `${bestScore}`} hint="保存在浏览器 localStorage" />
          <MetricCard
            label="最近成绩"
            value={recentResult ? `${recentResult.summary.scoreTotal}` : "--"}
            hint={
              recentResult
                ? `${recentResult.summary.tier.title} / ${recentResult.summary.correctCount} 题答对`
                : "完成一次挑战后这里会显示最近结果"
            }
          />
          <MetricCard label="挑战节奏" value="10 x 5s" hint="快节奏、自动超时、连续反转。" />
        </div>
      </section>

      {invalidStatuses.length > 0 ? (
        <section id="content-missing">
          <ContentStatus statuses={invalidStatuses} />
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
            玩法说明
          </p>
          <div className="space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
            <p>系统只会从计分题中随机抽取 10 题进入正式挑战。</p>
            <p>每题限时 5 秒，超时直接判错并进入下一题。</p>
            <p>结果页会根据你的得分、反应时间和最容易被骗的类型给出分析。</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
            关键提示
          </p>
          <div className="space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
            <p>你以为自己在看图，其实大脑已经先替你做了解释。</p>
            <p>长度、大小、方向、明暗和多义图像会轮流出现，反转总是跟在自信后面。</p>
            <p>答错不代表你看得不够仔细，往往只是你太快相信了第一眼。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
