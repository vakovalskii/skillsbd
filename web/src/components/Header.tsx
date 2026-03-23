"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AuthButton from "./AuthButton";

const ADMIN_USER_ID = "cmn2pemwd0000rv01qkeco1nb";

const navLinks = [
  { href: "/new", label: "Новые", dot: true },
  { href: "/official", label: "Официальные" },
  { href: "/docs", label: "Документация" },
  { href: "/submit", label: "Добавить" },
];

export default function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.id === ADMIN_USER_ID;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[10px] font-bold text-white">
            sb
          </span>
          <span className="text-lg font-semibold tracking-tight">skillsbd</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-foreground"
            >
              {link.label}
              {link.dot && (
                <span className="rounded-full bg-green-900/50 border border-green-800/50 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
                  {"\u2022"}
                </span>
              )}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-red-400 transition-colors hover:text-red-300">
              Админ
            </Link>
          )}
          <AuthButton />
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden flex flex-col gap-1 p-2"
          aria-label="Меню"
        >
          <span className={`block h-0.5 w-5 bg-gray-400 transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-0.5 w-5 bg-gray-400 transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-gray-400 transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="sm:hidden border-t border-gray-800 px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-foreground transition-colors py-1"
            >
              {link.label}
              {link.dot && (
                <span className="rounded-full bg-green-900/50 border border-green-800/50 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
                  {"\u2022"}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-800">
            <AuthButton />
          </div>
        </nav>
      )}
    </header>
  );
}
