"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { IllusionStage } from "@/components/illusions";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import { buildResult, calculateQuestionScore, normalizeAnswerIndex } from "@/lib/game/scoring";
import { deriveQuestionSeed, selectChallengeQuestions } from "@/lib/game/selection";
import { writeBestScore, writeRecentResult } from "@/lib/storage/local";
import type { Question } from "@/types/content";
import type { AnswerRecord } from "@/types/game";

const CHALLENGE_COUNT = 10;

export function GameClient({ questions }: { questions: Question[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const challengeSeed = useMemo(() => deriveQuestionSeed(questions), [questions]);
  const selectedQuestions = useMemo(
    () => selectChallengeQuestions(questions, CHALLENGE_COUNT, challengeSeed),
    [questions, challengeSeed],
  );
  const [index, setIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(() => (selectedQuestions?.[0]?.timeLimitSec ?? 0) * 1000);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [submittedQuestionId, setSubmittedQuestionId] = useState<string | null>(null);
  const lockRef = useRef(false);
  const startedAtRef = useRef(0);
  const recordsRef = useRef<AnswerRecord[]>([]);

  const currentQuestion = selectedQuestions?.[index] ?? null;

  const finishRun = useCallback(
    (nextRecords: AnswerRecord[]) => {
      const result = buildResult(nextRecords);
      writeRecentResult(result);
      writeBestScore(result.summary.scoreTotal);
      startTransition(() => router.push("/result"));
    },
    [router, startTransition],
  );

  const handleAnswer = useCallback(
    (selectedIndex: number | null, timedOut = false) => {
      if (!currentQuestion || lockRef.current || !selectedQuestions) {
        return;
      }

      lockRef.current = true;
      setSubmittedQuestionId(currentQuestion.id);
      setRemainingMs(0);

      const reactionMs = Math.min(Date.now() - startedAtRef.current, currentQuestion.timeLimitSec * 1000);
      const correctIndex = normalizeAnswerIndex(currentQuestion);
      const wasCorrect = selectedIndex !== null && selectedIndex === correctIndex;
      const awardedScore = calculateQuestionScore(currentQuestion, reactionMs, wasCorrect);

      const nextRecord: AnswerRecord = {
        questionId: currentQuestion.id,
        title: currentQuestion.title,
        prompt: currentQuestion.prompt,
        category: currentQuestion.category,
        selectedIndex,
        selectedLabel: selectedIndex === null ? null : currentQuestion.options[selectedIndex] ?? null,
        correctIndex,
        correctLabel: currentQuestion.options[correctIndex] ?? String(currentQuestion.answer),
        wasCorrect,
        wasTimeout: timedOut,
        reactionMs,
        awardedScore,
        explanation: currentQuestion.explanation,
        uiCopy: currentQuestion.uiCopy,
      };

      setFeedback(
        timedOut
          ? currentQuestion.uiCopy.timeout ?? "时间到了，错觉替你做了选择。"
          : wasCorrect
            ? currentQuestion.uiCopy.correct
            : currentQuestion.uiCopy.wrong,
      );

      const nextRecords = [...recordsRef.current, nextRecord];
      recordsRef.current = nextRecords;
      setRecords(nextRecords);

      window.setTimeout(() => {
        if (index + 1 >= selectedQuestions.length) {
          finishRun(nextRecords);
          return;
        }

        setIndex((current) => current + 1);
      }, 650);
    },
    [currentQuestion, finishRun, index, selectedQuestions],
  );

  useLayoutEffect(() => {
    if (!currentQuestion) {
      return;
    }

    lockRef.current = false;
    startedAtRef.current = Date.now();
    setSubmittedQuestionId(null);
    setRemainingMs(currentQuestion.timeLimitSec * 1000);
    setFeedback(null);

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const nextRemaining = Math.max(0, currentQuestion.timeLimitSec * 1000 - elapsed);
      setRemainingMs(nextRemaining);

      if (nextRemaining === 0 && !lockRef.current) {
        handleAnswer(null, true);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [currentQuestion, handleAnswer]);

  if (!selectedQuestions) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">题库尚未准备好</h1>
        <p className="max-w-xl text-slate-600 dark:text-slate-300">
          当前 `content-lab/data/questions.json` 缺失或可计分题少于 10 道，因此无法开始挑战。
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

  const progressRatio = ((index + 1) / selectedQuestions.length) * 100;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
                Question {index + 1} / {selectedQuestions.length}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {currentQuestion!.title}
              </h1>
            </div>
            <div className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">
              {Math.ceil(remainingMs / 1000)}s
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-cyan-500 transition-[width]" style={{ width: `${progressRatio}%` }} />
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{currentQuestion!.prompt}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              <span>{CATEGORY_LABELS[currentQuestion!.category]}</span>
              <span>{currentQuestion!.difficulty}</span>
              <span>{currentQuestion!.timeLimitSec}s</span>
            </div>
          </div>

          <div className="grid gap-3">
            {currentQuestion!.options.map((option, optionIndex) => (
              <button
                key={`${currentQuestion!.id}-${optionIndex}`}
                type="button"
                disabled={submittedQuestionId === currentQuestion!.id || isPending}
                onClick={() => handleAnswer(optionIndex, false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-base font-medium text-slate-900 transition hover:border-cyan-400 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                {option}
              </button>
            ))}
          </div>

          <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {feedback ?? currentQuestion!.uiCopy.intro}
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 dark:border-slate-800 dark:bg-slate-950/60">
          <IllusionStage question={currentQuestion!} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
        已完成 {records.length} / {selectedQuestions.length} 题。超时会自动判错并跳转下一题。
      </div>
    </div>
  );
}
