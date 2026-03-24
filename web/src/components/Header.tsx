"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";

const mainTabs = [
  { href: "/", label: "Skills" },
  { href: "/mcp", label: "MCP" },
  { href: "/tools", label: "CLI" },
];

const moreLinks = [
  { href: "/new", label: "Новые навыки" },
  { href: "/official", label: "Выбор редакции" },
  { href: "/submit", label: "Добавить навык" },
  { href: "/docs", label: "Документация" },
  { href: "/docs/api", label: "API" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "О проекте" },
];

export default function Header() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin === true))
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[10px] font-bold text-white relative">
            sb
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 animate-live" />
          </span>
          <span className="text-lg font-semibold tracking-tight hidden sm:inline">skillsbd</span>
        </Link>

        {/* Main tabs — desktop */}
        <nav className="hidden sm:flex items-center gap-1 ml-6">
          {mainTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive(tab.href)
                  ? "bg-gray-900 text-foreground"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-900/50"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Right side — desktop */}
        <div className="hidden sm:flex items-center gap-2 ml-auto">
          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-900/50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="13" cy="8" r="1.5" />
              </svg>
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-800 bg-gray-950 py-1 shadow-xl animate-fade-in">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-400 hover:text-foreground hover:bg-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <>
                    <div className="border-t border-gray-800 my-1" />
                    <Link
                      href="/admin"
                      onClick={() => setMoreOpen(false)}
                      className="block px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-900 transition-colors"
                    >
                      Админ-панель
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <AuthButton />
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden flex flex-col gap-1 p-2"
          aria-label="Меню"
        >
          <span className={`block h-0.5 w-5 bg-gray-400 transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-0.5 w-5 bg-gray-400 transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-gray-400 transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="sm:hidden border-t border-gray-800 px-4 py-3 flex flex-col gap-1 animate-fade-in">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Экосистема</p>
          {mainTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(tab.href)
                  ? "bg-gray-900 text-foreground"
                  : "text-gray-400 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
          <div className="border-t border-gray-800 my-2" />
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Ещё</p>
          {moreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm text-gray-400 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Админ-панель
            </Link>
          )}
          <div className="border-t border-gray-800 mt-2 pt-3">
            <AuthButton />
          </div>
        </nav>
      )}
    </header>
  );
}
