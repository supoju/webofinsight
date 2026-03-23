"use client";

import { useEffect, useSyncExternalStore } from "react";

import { readTheme, subscribeStorageChanges, writeTheme } from "@/lib/storage/local";

type ThemeMode = "light" | "dark" | "system";

function resolveTheme(mode: ThemeMode) {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(
    subscribeStorageChanges,
    () => {
      const stored = readTheme();
      return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    },
    () => "system",
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const stored = readTheme();
    const nextMode =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const root = document.documentElement;
    root.dataset.theme = nextMode;
    root.classList.toggle("dark", resolveTheme(nextMode) === "dark");
  }, [mode]);

  return (
    <>
      <button
        type="button"
        className="fixed top-4 right-4 z-50 rounded-full border border-white/20 bg-slate-950/80 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-slate-100 backdrop-blur dark:border-cyan-300/20 dark:bg-slate-100/10"
        onClick={() =>
          writeTheme(
            mode === "system" ? "dark" : mode === "dark" ? "light" : "system",
          )
        }
      >
        Theme: {mode}
      </button>
      {children}
    </>
  );
}
