import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
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
    <html lang="zh-CN" className={`${grotesk.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#dbeafe_55%,#f8fafc)] text-slate-950 antialiased dark:bg-[linear-gradient(180deg,#020617,#0f172a_55%,#020617)] dark:text-slate-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
