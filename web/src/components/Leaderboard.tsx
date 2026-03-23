"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatInstalls, type Skill } from "@/data/skills";

type SortMode = "all" | "trending" | "hot";

interface LeaderboardProps {
  initialSkills: Skill[];
  totalInstalls: number;
  totalTrending: number;
}

export default function Leaderboard({
  initialSkills,
  totalInstalls,
  totalTrending,
}: LeaderboardProps) {
  const router = useRouter();
  const [sortMode, setSortMode] = useState<SortMode>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...initialSkills];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.owner.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortMode) {
      case "trending":
        list.sort((a, b) => b.trending24h - a.trending24h);
        break;
      case "hot":
        list.sort(
          (a, b) =>
            b.trending24h / Math.max(b.installs, 1) -
            a.trending24h / Math.max(a.installs, 1)
        );
        break;
      default:
        list.sort((a, b) => b.installs - a.installs);
    }

    return list;
  }, [sortMode, search, initialSkills]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск навыков..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-foreground placeholder:text-gray-600 outline-none focus:border-gray-600 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500">
          /
        </kbd>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        <button
          onClick={() => setSortMode("all")}
          className={`px-3 py-2 text-sm transition-colors border-b-2 ${
            sortMode === "all"
              ? "border-accent text-foreground"
              : "border-transparent text-gray-500 hover:text-gray-400"
          }`}
        >
          За все время{" "}
          <span className="text-gray-600">
            ({formatInstalls(totalInstalls)})
          </span>
        </button>
        <button
          onClick={() => setSortMode("trending")}
          className={`px-3 py-2 text-sm transition-colors border-b-2 ${
            sortMode === "trending"
              ? "border-accent text-foreground"
              : "border-transparent text-gray-500 hover:text-gray-400"
          }`}
        >
          Тренды 24ч{" "}
          <span className="text-gray-600">
            ({formatInstalls(totalTrending)})
          </span>
        </button>
        <button
          onClick={() => setSortMode("hot")}
          className={`px-3 py-2 text-sm transition-colors border-b-2 ${
            sortMode === "hot"
              ? "border-accent text-foreground"
              : "border-transparent text-gray-500 hover:text-gray-400"
          }`}
        >
          Горячее
        </button>
      </div>

      {/* Table */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_80px] gap-2 px-2 py-2 text-xs text-gray-600">
          <span>#</span>
          <span>Навык</span>
          <span className="text-right">Установки</span>
        </div>

        {/* Rows */}
        {filtered.map((skill, i) => (
          <div
            key={skill.id}
            onClick={() => router.push(`/skill/${skill.id}`)}
            className="group grid grid-cols-[40px_1fr_80px] gap-2 rounded-lg px-2 py-3 transition-colors hover:bg-gray-900 cursor-pointer items-center"
          >
            <span className="text-sm text-gray-600">{i + 1}</span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {skill.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-600 truncate">
                <span className="font-mono">{skill.owner}/{skill.repo}</span>
                {skill.authorName && (
                  <span className="text-gray-500">
                    {skill.telegramLink ? (
                      <a
                        href={skill.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {skill.authorName}
                      </a>
                    ) : (
                      skill.authorName
                    )}
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-400 text-right font-mono">
              {sortMode === "trending"
                ? `+${formatInstalls(skill.trending24h)}`
                : formatInstalls(skill.installs)}
            </span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-600">
            {initialSkills.length === 0
              ? "Пока нет навыков. Будьте первым!"
              : "Навыки не найдены"}
          </div>
        )}
      </div>
    </div>
  );
}
