"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface Skill {
  id: string;
  name: string;
  owner: string;
  repo: string;
  description: string;
  status: string;
  featured: boolean;
  installs: number;
  githubStars: number;
  createdAt: string;
  _count: { comments: number };
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<"date" | "installs" | "stars">("date");

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((r) => { if (r.status === 403) throw new Error("Нет доступа"); return r.json(); })
      .then((data) => { if (Array.isArray(data)) setSkills(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Удалить навык "${name}"?`)) return;
    await fetch("/api/admin/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: id }),
    });
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }

  async function toggleFeatured(id: string, current: boolean) {
    await fetch("/api/admin/skills", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: id, featured: !current }),
    });
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, featured: !current } : s));
  }

  const sorted = [...skills].sort((a, b) => {
    if (sort === "installs") return b.installs - a.installs;
    if (sort === "stars") return b.githubStars - a.githubStars;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) return <><Header /><main className="mx-auto max-w-5xl px-4 py-12"><p className="text-gray-600">Загрузка...</p></main></>;
  if (error) return <><Header /><main className="mx-auto max-w-5xl px-4 py-12"><p className="text-red-400">{error}</p></main></>;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Навыки ({skills.length})</h1>
          <div className="flex gap-2">
            {(["date", "installs", "stars"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1 text-xs rounded-md border transition-colors ${sort === s ? "border-accent text-accent" : "border-gray-800 text-gray-500 hover:text-gray-400"}`}
              >
                {s === "date" ? "Дата" : s === "installs" ? "Установки" : "Звёзды"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {sorted.map((skill) => (
            <div key={skill.id} className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <a href={`/skill/${skill.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9а-яё\-]/gi, '')}`} className="font-medium text-sm hover:text-accent transition-colors truncate">
                    {skill.name}
                  </a>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${skill.status === "approved" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                    {skill.status}
                  </span>
                  {skill.featured && <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">рек</span>}
                </div>
                <p className="text-xs text-gray-600 mt-0.5 truncate">{skill.owner}/{skill.repo}</p>
              </div>
              <span className="text-xs text-yellow-500/70 font-mono shrink-0">★{skill.githubStars}</span>
              <span className="text-xs text-gray-500 font-mono shrink-0">↓{skill.installs}</span>
              <span className="text-xs text-gray-600 shrink-0">{skill._count.comments} комм.</span>
              <button
                onClick={() => toggleFeatured(skill.id, skill.featured)}
                className={`shrink-0 rounded border px-2 py-1 text-xs transition-colors ${
                  skill.featured
                    ? "border-accent/50 text-accent hover:bg-accent/10"
                    : "border-gray-800 text-gray-600 hover:text-gray-400"
                }`}
              >
                {skill.featured ? "★ Ред." : "☆"}
              </button>
              <button
                onClick={() => handleDelete(skill.id, skill.name)}
                className="shrink-0 rounded border border-red-800/50 px-2 py-1 text-xs text-red-400 hover:bg-red-900/30 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
