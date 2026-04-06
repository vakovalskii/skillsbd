"use client";

import { useState, useEffect } from "react";
import { formatInstalls } from "@/data/skills";

interface Skill {
  id: string;
  name: string;
  owner: string;
  repo: string;
  description: string;
  installs: number;
  trending24h: number;
  category: string;
  tags: string[];
  type: string;
  status: string;
  authorName: string | null;
  telegramLink: string | null;
  createdAt: string;
}

type EditingSkill = {
  id: string;
  name: string;
  owner: string;
  repo: string;
  description: string;
  category: string;
  tags: string;
  authorName: string;
  telegramLink: string;
};

export default function DashboardContent() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingSkill | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/my-skills")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function startEdit(skill: Skill) {
    setEditing({
      id: skill.id,
      name: skill.name,
      owner: skill.owner,
      repo: skill.repo,
      description: skill.description,
      category: skill.category,
      tags: skill.tags.join(", "),
      authorName: skill.authorName || "",
      telegramLink: skill.telegramLink || "",
    });
  }

  async function saveEdit() {
    if (!editing || saving) return;
    setSaving(true);

    try {
      const res = await fetch("/api/my-skills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: editing.id,
          name: editing.name,
          owner: editing.owner,
          repo: editing.repo,
          description: editing.description,
          category: editing.category,
          tags: editing.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          authorName: editing.authorName,
          telegramLink: editing.telegramLink,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setEditing(null);
      }
    } catch {}
    setSaving(false);
  }

  async function deleteSkill(id: string) {
    if (!confirm("Удалить навык? Это действие нельзя отменить.")) return;
    setDeleting(id);

    try {
      const res = await fetch("/api/my-skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: id }),
      });

      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {}
    setDeleting(null);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-900" />
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
        <p className="text-gray-500 text-lg mb-4">У вас пока нет навыков</p>
        <a
          href="/submit"
          className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          Добавить первый навык
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700"
        >
          {editing?.id === skill.id ? (
            /* Edit mode */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Название</label>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Категория</label>
                  <input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">GitHub Owner</label>
                  <input
                    value={editing.owner}
                    onChange={(e) => setEditing({ ...editing, owner: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm font-mono outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">GitHub Repo</label>
                  <input
                    value={editing.repo}
                    onChange={(e) => setEditing({ ...editing, repo: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm font-mono outline-none focus:border-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Описание</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-gray-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Теги <span className="text-gray-600">(через запятую)</span>
                </label>
                <input
                  value={editing.tags}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                  className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Имя автора</label>
                  <input
                    value={editing.authorName}
                    onChange={(e) => setEditing({ ...editing, authorName: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Telegram</label>
                  <input
                    value={editing.telegramLink}
                    onChange={(e) => setEditing({ ...editing, telegramLink: e.target.value })}
                    placeholder="https://t.me/username"
                    className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-foreground transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        skill.status === "approved"
                          ? "bg-green-900/30 text-green-400 border border-green-800/40"
                          : skill.status === "pending"
                          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/40"
                          : "bg-red-900/30 text-red-400 border border-red-800/40"
                      }`}
                    >
                      {skill.status === "approved"
                        ? "опубликован"
                        : skill.status === "pending"
                        ? "на модерации"
                        : "отклонён"}
                    </span>
                    <span className="rounded border border-gray-700 px-1.5 py-0.5 text-[10px] text-gray-500">
                      {skill.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span className="font-mono">{skill.owner}/{skill.repo}</span>
                    <span>{formatInstalls(skill.installs)} установок</span>
                    <span>
                      {new Date(skill.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  {skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-800/50 px-1.5 py-0.5 text-[10px] text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(skill)}
                    className="rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-foreground hover:border-gray-600 transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    disabled={deleting === skill.id}
                    className="rounded-md border border-red-800/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    {deleting === skill.id ? "..." : "Удалить"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
