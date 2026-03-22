"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-800 bg-background/80 backdrop-blur-md px-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-foreground"
          >
            <path d="M12 2L2 19.5h20L12 2z" fill="currentColor" />
          </svg>
          <span className="h-5 w-px bg-gray-700" />
          <span className="text-lg font-medium tracking-tight">
            Skills<span className="text-accent">.RU</span>
          </span>
        </Link>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="/official"
          className="hidden sm:flex items-center gap-1.5 text-gray-400 transition-colors hover:text-foreground"
        >
          Официальные
          <span className="rounded-full border border-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            New
          </span>
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
