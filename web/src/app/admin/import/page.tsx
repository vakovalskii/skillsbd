"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface ScanResult {
  owner: string;
  repo: string;
  stars: number;
  description: string;
  license: string | null;
  skills: { name: string; path: string; hasSkillMd: boolean }[];
}

export default function AdminImportPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [category, setCategory] = useState("утилиты");
  const [featured, setFeatured] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importResult, setImportResult] = useState("");
  const [error, setError] = useState("");

  async function handleScan() {
    setScanning(true);
    setError("");
    setResult(null);
    setImportResult("");

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка"); setScanning(false); return; }
      setResult(data);
      setSelected(new Set(data.skills.map((s: { name: string }) => s.name)));
    } catch (e) {
      setError("Ошибка при сканировании");
    }
    setScanning(false);
  }

  async function handleImport() {
    if (!result || selected.size === 0) return;
    setImporting(true);

    const res = await fetch("/api/admin/import", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: result.owner,
        repo: result.repo,
        skills: Array.from(selected),
        authorName: authorName || null,
        telegramLink: telegramLink || null,
        category,
        featured,
      }),
    });
    const data = await res.json();
    setImportResult(`Импортировано: ${data.imported} навыков`);
    setImporting(false);
  }

  function toggleSkill(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Импорт навыков из GitHub</h1>

        <div className="flex flex-col gap-4 mb-8">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-400">URL репозитория</span>
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-gray-400">Имя автора</span>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Polyakov"
                className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-gray-400">Telegram</span>
              <input
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://t.me/channel"
                className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-gray-400">Категория</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600"
              >
                {["утилиты", "фронтенд", "бэкенд", "девопс", "тестирование", "безопасность", "дизайн", "контент", "мобильные", "фреймворки", "языки", "стили"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 self-end py-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-400">Рекомендованный</span>
            </label>
          </div>

          <button
            onClick={handleScan}
            disabled={!repoUrl || scanning}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50 w-fit"
          >
            {scanning ? "Сканирование..." : "Сканировать репозиторий"}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {result && (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-semibold">{result.owner}/{result.repo}</h2>
              <span className="text-xs text-yellow-500/70 font-mono">★{result.stars}</span>
              {result.license && <span className="text-xs text-gray-600">{result.license}</span>}
            </div>
            {result.description && <p className="text-sm text-gray-400 mb-4">{result.description}</p>}

            <p className="text-sm text-gray-500 mb-3">Найдено навыков: {result.skills.length}</p>

            {result.skills.length === 0 ? (
              <p className="text-sm text-gray-600">Навыки не найдены в репозитории</p>
            ) : (
              <>
                <div className="flex flex-col gap-1 mb-4 max-h-80 overflow-y-auto">
                  {result.skills.map((s) => (
                    <label key={s.name} className="flex items-center gap-3 rounded p-2 hover:bg-gray-800/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.has(s.name)}
                        onChange={() => toggleSkill(s.name)}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-xs text-gray-600 ml-2">{s.path}</span>
                      </div>
                      {s.hasSkillMd ? (
                        <span className="text-[10px] text-green-400 bg-green-900/30 rounded px-1.5 py-0.5">SKILL.md</span>
                      ) : (
                        <span className="text-[10px] text-yellow-400 bg-yellow-900/30 rounded px-1.5 py-0.5">нет SKILL.md</span>
                      )}
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleImport}
                    disabled={selected.size === 0 || importing}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                  >
                    {importing ? "Импорт..." : `Импортировать ${selected.size} навыков`}
                  </button>
                  <button
                    onClick={() => selected.size === result.skills.length ? setSelected(new Set()) : setSelected(new Set(result.skills.map((s) => s.name)))}
                    className="text-xs text-gray-500 hover:text-gray-400"
                  >
                    {selected.size === result.skills.length ? "Снять все" : "Выбрать все"}
                  </button>
                </div>
              </>
            )}

            {importResult && (
              <p className="text-green-400 text-sm mt-4">{importResult}</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
