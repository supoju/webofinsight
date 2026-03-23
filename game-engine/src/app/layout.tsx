import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optical Illusion Game",
  description: "A fast 10-question illusion challenge built for App Router and Vercel Hobby.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#dbeafe_55%,#f8fafc)] text-slate-950 antialiased dark:bg-[linear-gradient(180deg,#020617,#0f172a_55%,#020617)] dark:text-slate-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
