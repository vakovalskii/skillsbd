"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { mcpServers } from "@/data/mcp-servers";


const servers = mcpServers;

export default function McpGrid() {
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(() =>
    searchParams.get("filter") === "russian" ? "Российские" : ""
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(servers.map((s) => s.category));
    return Array.from(cats).sort();
  }, []);

  const filtered = useMemo(() => {
    let list = servers;
    if (activeCategory) list = list.filter((s) => s.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory]);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Поиск MCP серверов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-foreground placeholder:text-gray-600 outline-none focus:border-gray-600 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory("")}
          className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
            !activeCategory
              ? "bg-accent/15 text-accent border border-accent/30"
              : "border border-gray-800 text-gray-500 hover:text-gray-400"
          }`}
        >
          Все ({servers.length})
        </button>
        {categories.map((cat) => {
          const count = servers.filter((s) => s.category === cat).length;
          const isRu = cat === "Российские";
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? "" : cat)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                activeCategory === cat
                  ? isRu ? "bg-red-900/30 text-red-400 border border-red-800/40" : "bg-accent/15 text-accent border border-accent/30"
                  : "border border-gray-800 text-gray-500 hover:text-gray-400"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filtered.map((server) => (
          <a
            key={server.name}
            href={`/mcp/${server.slug}`}
            
            
            className="flex flex-col rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 hover-glow card-shine transition-all group"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {server.name}
              </h3>
              {server.category === "Российские" && (
                <span className="rounded bg-red-900/30 border border-red-800/40 px-1.5 py-0.5 text-[10px] font-bold text-red-400">RU</span>
              )}
              {server.stars > 0 && (
                <span className="text-xs text-yellow-500/70 font-mono">★{server.stars}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 flex-1 mb-3 line-clamp-3">{server.desc}</p>
            <div className="rounded-md bg-gray-950 border border-gray-800 px-2 py-1.5 mb-3">
              <code className="text-[11px] text-accent break-all">{server.install}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600">{server.author}</span>
              <span className="text-[10px] text-gray-700">{server.license}</span>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-600 py-8">MCP серверы не найдены</p>
      )}
    </div>
  );
}
