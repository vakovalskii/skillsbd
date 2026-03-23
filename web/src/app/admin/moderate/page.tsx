"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface PendingSkill {
  id: string;
  name: string;
  owner: string;
  repo: string;
  description: string;
  category: string;
  authorName: string | null;
  telegramLink: string | null;
  createdAt: string;
  author: { name: string | null; email: string | null; image: string | null } | null;
}

export default function ModeratePage() {
  const [skills, setSkills] = useState<PendingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/moderate")
      .then((r) => {
        if (r.status === 403) throw new Error("Нет доступа");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  async function handleAction(skillId: string, action: "approve" | "reject") {
    await fetch("/api/admin/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId, action }),
    });
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Модерация навыков</h1>
        <p className="text-gray-500 mb-8">Навыки, ожидающие проверки</p>

        {loading && <p className="text-gray-600">Загрузка...</p>}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/20 p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && skills.length === 0 && (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
            <p className="text-gray-500 text-lg">Нет навыков на модерации</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="rounded-lg border border-yellow-800/50 bg-yellow-900/10 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{skill.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                    <span className="font-mono">{skill.owner}/{skill.repo}</span>
                    <span>{skill.category}</span>
                    {skill.authorName && <span>Автор: {skill.authorName}</span>}
                    {skill.telegramLink && (
                      <a href={skill.telegramLink} target="_blank" rel="noopener noreferrer" className="text-accent">
                        Telegram
                      </a>
                    )}
                    {skill.author?.name && (
                      <span className="flex items-center gap-1">
                        {skill.author.image && (
                          <img src={skill.author.image} alt="" className="h-4 w-4 rounded-full" />
                        )}
                        {skill.author.name}
                      </span>
                    )}
                    <span>{new Date(skill.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => handleAction(skill.id, "approve")}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors"
                  >
                    Одобрить
                  </button>
                  <button
                    onClick={() => handleAction(skill.id, "reject")}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
