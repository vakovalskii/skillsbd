import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import YandexMetrika from "@/components/YandexMetrika";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "NeuralDeep — агрегатор навыков, MCP серверов и AI-инструментов";
const description =
  "Российский агрегатор для AI-агентов: навыки, MCP серверы, CLI инструменты. Яндекс, Битрикс, 1С, GigaChat и другие сервисы. Open source каталог для Claude Code, Cursor, Codex.";
const url = "https://neuraldeep.ru";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: "%s | NeuralDeep",
  },
  description,
  keywords: [
    "AI навыки",
    "AI агенты",
    "Claude Code",
    "Cursor",
    "Copilot",
    "Windsurf",
    "Cline",
    "навыки для агентов",
    "skills",
    "каталог навыков",
    "skillsbd",
    "Яндекс",
    "Битрикс",
    "1С",
    "российские сервисы",
    "RU комьюнити",
  ],
  authors: [{ name: "NeuralDeep" }],
  creator: "NeuralDeep",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url,
    siteName: "NeuralDeep",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try { const t = localStorage.getItem('theme'); if (t) { document.documentElement.classList.remove('dark','light'); document.documentElement.classList.add(t); } } catch {}
        ` }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Suspense><YandexMetrika /></Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
