"use client";

import { useState } from "react";

const skillCategories = [
  "фронтенд", "бэкенд", "девопс", "утилиты", "тестирование",
  "безопасность", "дизайн", "контент", "мобильные", "фреймворки", "языки", "стили",
];

const mcpCategories = [
  "Российские", "DevOps", "Браузер", "Базы данных", "API интеграции", "Утилиты",
];

const cliCategories = [
  "CLI генераторы", "Управление навыками", "Агенты", "Утилиты разработки",
  "Тестирование", "DevOps", "Работа с API",
];

const typeLabels = {
  skill: "Навык (Skill)",
  mcp: "MCP сервер",
  cli: "CLI инструмент",
} as const;

type SubmitType = "skill" | "mcp" | "cli";

export default function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<SubmitType>("skill");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      name: form.get("name"),
      owner: form.get("owner"),
      repo: form.get("repo"),
      description: form.get("description"),
      category: form.get("category"),
      authorName: form.get("authorName"),
      telegramLink: form.get("telegramLink"),
      type,
    };

    // CLI-specific: store install command and lang in tags
    if (type === "cli") {
      const installCmd = (form.get("installCmd") as string) || "";
      const lang = (form.get("lang") as string) || "";
      const license = (form.get("license") as string) || "";
      const tags: string[] = [];
      if (lang) tags.push(`lang:${lang}`);
      if (license) tags.push(`license:${license}`);
      if (installCmd) tags.push(`install:${installCmd}`);
      data.tags = tags;
    }

    const res = await fetch("/api/skills/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-800 bg-green-900/20 p-8 text-center">
        <p className="text-green-400 text-lg font-medium mb-2">{typeLabels[type]} отправлен на модерацию</p>
        <p className="text-gray-500">Мы проверим и добавим в каталог.</p>
      </div>
    );
  }

  const categories =
    type === "mcp" ? mcpCategories : type === "cli" ? cliCategories : skillCategories;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex gap-2 flex-wrap">
        {(["skill", "mcp", "cli"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              type === t
                ? "bg-accent/15 text-accent border border-accent/30"
                : "border border-gray-800 text-gray-500 hover:text-gray-400"
            }`}
          >
            {typeLabels[t]}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">
            Название *
          </span>
          <input
            name="name"
            required
            placeholder={type === "cli" ? "my-cli-tool" : type === "mcp" ? "my-mcp-server" : "my-awesome-skill"}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Категория *</span>
          <select
            name="category"
            required
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          >
            <option value="">Выберите...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Владелец (GitHub) *</span>
          <input
            name="owner"
            required
            placeholder="username"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Репозиторий *</span>
          <input
            name="repo"
            required
            placeholder="my-repo"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-400">Описание *</span>
        <textarea
          name="description"
          required
          rows={3}
          placeholder={
            type === "cli"
              ? "Кратко опишите, что делает ваш CLI инструмент..."
              : type === "mcp"
              ? "Кратко опишите, что делает ваш MCP сервер..."
              : "Кратко опишите, что делает ваш навык..."
          }
          className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors resize-none"
        />
      </label>

      {/* CLI-specific fields */}
      {type === "cli" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-400">Команда установки *</span>
            <input
              name="installCmd"
              required
              placeholder="npm install -g my-tool"
              className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm font-mono outline-none focus:border-gray-600 transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-400">Язык</span>
            <select
              name="lang"
              className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
            >
              <option value="">—</option>
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="Shell">Shell</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-400">Лицензия</span>
            <select
              name="license"
              className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
            >
              <option value="">—</option>
              <option value="MIT">MIT</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="GPL-3.0">GPL 3.0</option>
              <option value="BSD-3">BSD 3</option>
              <option value="ISC">ISC</option>
            </select>
          </label>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Ваше имя</span>
          <input
            name="authorName"
            placeholder="Имя автора"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Telegram канал</span>
          <input
            name="telegramLink"
            placeholder="https://t.me/your_channel"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors w-fit"
      >
        Отправить на модерацию
      </button>
    </form>
  );
}
