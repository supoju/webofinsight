import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const bodyFont = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans-ui",
  weight: ["400", "500", "600", "700"],
});

const displayFont = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-display-ui",
  weight: ["600", "700"],
});

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
      <body
        suppressHydrationWarning
        className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-[linear-gradient(180deg,#f8fafc,#dbeafe_55%,#f8fafc)] text-slate-950 antialiased dark:bg-[linear-gradient(180deg,#020617,#0f172a_55%,#020617)] dark:text-slate-100`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
