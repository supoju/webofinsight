import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">页面不存在</h1>
      <p className="text-slate-600 dark:text-slate-300">
        这条路径没有对应的挑战内容。返回首页重新进入游戏。
      </p>
      <Link href="/" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white dark:bg-cyan-300 dark:text-slate-950">
        返回首页
      </Link>
    </div>
  );
}
