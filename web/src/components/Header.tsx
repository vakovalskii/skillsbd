"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-800 bg-background/80 backdrop-blur-md px-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[10px] font-bold text-white">
            sb
          </span>
          <span className="text-lg font-semibold tracking-tight">
            skillsbd
          </span>
        </Link>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="/new"
          className="hidden sm:flex items-center gap-1.5 text-gray-400 transition-colors hover:text-foreground"
        >
          Новые
          <span className="rounded-full bg-green-900/50 border border-green-800/50 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
            {"\u2022"}
          </span>
        </Link>
        <Link
          href="/official"
          className="hidden sm:inline text-gray-400 transition-colors hover:text-foreground"
        >
          Официальные
        </Link>
        <Link
          href="/docs"
          className="hidden sm:inline text-gray-400 transition-colors hover:text-foreground"
        >
          Документация
        </Link>
        <Link
          href="/submit"
          className="hidden sm:inline text-gray-400 transition-colors hover:text-foreground"
        >
          Добавить
        </Link>
        <AuthButton />
      </nav>
    </header>
  );
}
