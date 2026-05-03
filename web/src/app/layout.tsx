import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import YandexMetrika from "@/components/YandexMetrika";
import AgentChat from "@/components/AgentChat";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
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

const title = "NeuralDeep — AI-инфраструктура on-prem в России";
const description =
  "Делаем on-prem LLM-системы, корпоративный поиск, RAG и аудио-транскрипцию на собственных GPU в РФ. 5 продуктов в проде, 1100+⭐ open source — и сделаем под вас.";
const url = "https://neuraldeep.ru";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: "%s | NeuralDeep",
  },
  description,
  keywords: [
    "LLM API",
    "on-prem AI",
    "self-hosted LLM",
    "OpenAI совместимый API",
    "корпоративный RAG",
    "AI-инфраструктура",
    "GPU on-prem",
    "AI агенты",
    "MCP серверы",
    "Claude Code",
    "Cursor",
    "Whisper",
    "транскрипция аудио",
    "российские AI сервисы",
    "Яндекс",
    "1С",
    "Битрикс",
    "GigaChat",
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
        <Providers>
          {children}
          <Footer />
          <AgentChat />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
