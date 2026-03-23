import type { ContentFileStatus } from "@/types/content";

export function ContentStatus({ statuses }: { statuses: ContentFileStatus[] }) {
  return (
    <div className="rounded-3xl border border-amber-300/60 bg-amber-50/80 p-4 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-100">
      <p className="font-semibold">内容接口状态</p>
      <ul className="mt-3 space-y-2">
        {statuses.map((status) => (
          <li key={status.key}>
            <span className="font-medium">{status.key}</span>: {status.state}
            {status.detail ? ` (${status.detail})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
