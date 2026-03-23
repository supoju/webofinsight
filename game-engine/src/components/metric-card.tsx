export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}
