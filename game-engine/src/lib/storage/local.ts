"use client";

import type { ChallengeResult } from "@/types/game";

const STORAGE_KEYS = {
  bestScore: "optical-illusion-game:best-score",
  recentResult: "optical-illusion-game:recent-result",
  theme: "optical-illusion-game:theme",
} as const;

const listeners = new Set<() => void>();
let recentResultCacheRaw: string | null | undefined;
let recentResultCacheValue: ChallengeResult | null = null;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyStorageChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeStorageChanges(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  listeners.add(listener);
  const handleStorage = () => listener();
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function readBestScore() {
  if (!canUseStorage()) {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEYS.bestScore);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function writeBestScore(score: number) {
  if (!canUseStorage()) {
    return;
  }

  const previous = readBestScore();
  if (previous === null || score > previous) {
    window.localStorage.setItem(STORAGE_KEYS.bestScore, String(score));
    notifyStorageChange();
  }
}

export function readRecentResult(): ChallengeResult | null {
  if (!canUseStorage()) {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEYS.recentResult);
  if (!value) {
    recentResultCacheRaw = null;
    recentResultCacheValue = null;
    return null;
  }

  if (value === recentResultCacheRaw) {
    return recentResultCacheValue;
  }

  try {
    recentResultCacheValue = JSON.parse(value) as ChallengeResult;
    recentResultCacheRaw = value;
    return recentResultCacheValue;
  } catch {
    recentResultCacheRaw = value;
    recentResultCacheValue = null;
    return null;
  }
}

export function writeRecentResult(result: ChallengeResult) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.recentResult, JSON.stringify(result));
  notifyStorageChange();
}

export function readTheme() {
  if (!canUseStorage()) {
    return "system";
  }

  return window.localStorage.getItem(STORAGE_KEYS.theme) ?? "system";
}

export function writeTheme(theme: "light" | "dark" | "system") {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  notifyStorageChange();
}
