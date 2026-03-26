"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { ContentStatus } from "@/components/content-status";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DisplayTitle, Eyebrow, Lead } from "@/components/ui/typography";
import { readBestScore, readRecentResult, subscribeStorageChanges } from "@/lib/storage/local";
import { cn } from "@/lib/utils";
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
        <Card
          data-testid="home-hero"
          className="bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_24rem),linear-gradient(145deg,_rgba(255,255,255,0.97),_rgba(241,245,249,0.9))] backdrop-blur dark:bg-[radial-gradient(circle_at_top_left,_rgba(103,232,249,0.12),_transparent_22rem),linear-gradient(145deg,_rgba(2,6,23,0.95),_rgba(15,23,42,0.9))]"
        >
          <CardContent className="p-8">
            <Badge className="border-cyan-300/70 bg-cyan-50 text-cyan-950 dark:border-cyan-400/30 dark:bg-cyan-950/40 dark:text-cyan-100">
              Optical Illusion Game
            </Badge>
            <DisplayTitle className="mt-5 max-w-2xl">
              第一眼越自信，反转就越疼。
            </DisplayTitle>
            <Lead className="mt-4 max-w-2xl">
              10 题快节奏视觉错觉挑战。每题只有 5 秒，你要在视觉直觉和真实结构之间抢回控制权。
            </Lead>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={canStart ? "/play" : "#content-missing"}
                className={cn(
                  "inline-flex min-w-[12rem] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition",
                  canStart
                    ? "bg-primary text-primary-foreground shadow-[0_18px_35px_-22px_rgba(8,47,73,0.75)] hover:-translate-y-0.5 hover:bg-primary/90"
                    : "cursor-not-allowed bg-muted text-muted-foreground",
                )}
              >
                开始 10 题挑战
              </Link>
              <div className="rounded-full border border-border/80 bg-card px-4 py-3 text-sm text-muted-foreground">
                {canStart
                  ? "10 题随机挑战已就绪，连续反转从第一眼开始。"
                  : "题库仍有校验问题，修复后即可开启挑战。"}
              </div>
            </div>
          </CardContent>
        </Card>

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
        <Card className="bg-card/88">
          <CardContent className="p-8">
            <Eyebrow className="mb-4">玩法说明</Eyebrow>
            <div className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>系统只会从计分题中随机抽取 10 题进入正式挑战。</p>
              <p>每题限时 5 秒，超时直接判错并进入下一题。</p>
              <p>结果页会根据你的得分、反应时间和最容易被骗的类型给出分析。</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/88">
          <CardContent className="p-8">
            <Eyebrow className="mb-4">关键提示</Eyebrow>
            <div className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>你以为自己在看图，其实大脑已经先替你做了解释。</p>
              <p>长度、大小、方向、明暗和多义图像会轮流出现，反转总是跟在自信后面。</p>
              <p>答错不代表你看得不够仔细，往往只是你太快相信了第一眼。</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
