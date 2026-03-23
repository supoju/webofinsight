export function StageFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_50%),linear-gradient(135deg,#ffffff,#e2e8f0)] p-5 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.9)] dark:border-slate-700 dark:bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.14),_transparent_45%),linear-gradient(135deg,#020617,#172554)]">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-cyan-200/70">
        <span>{label}</span>
        <span>look twice</span>
      </div>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-white/70 p-3 dark:bg-slate-950/70">
        {children}
      </div>
    </div>
  );
}
