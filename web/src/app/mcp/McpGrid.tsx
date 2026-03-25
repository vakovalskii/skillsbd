"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface McpServer {
  name: string;
  desc: string;
  author: string;
  stars: number;
  license: string;
  url: string;
  install: string;
  category: string;
  tags: string[];
}

const servers: McpServer[] = [
  // === Российские ===
  {
    name: "Yandex Tracker MCP",
    desc: "MCP сервер для Yandex Tracker API. Задачи, проекты, спринты — управление через AI-агента.",
    author: "sunnyyssh",
    stars: 3,
    license: "MIT",
    url: "https://github.com/sunnyyssh/mcp-yandex-tracker",
    install: "go install github.com/sunnyyssh/mcp-yandex-tracker@latest",
    category: "Российские",
    tags: ["яндекс", "tracker", "задачи", "проекты"],
  },
  {
    name: "GigaChat Image MCP",
    desc: "Генерация изображений через GigaChat API от Сбера. MCP сервер для визуального контента.",
    author: "grentank",
    stars: 0,
    license: "MIT",
    url: "https://github.com/grentank/mcp-server-gigachat-image-generation",
    install: "pip install mcp-server-gigachat-image",
    category: "Российские",
    tags: ["gigachat", "сбер", "изображения", "генерация"],
  },
  {
    name: "Telegram MCP",
    desc: "MCP сервер для Telegram. Отправка сообщений, чтение чатов, работа с ботами.",
    author: "DemoVersion",
    stars: 0,
    license: "MIT",
    url: "https://github.com/DemoVersion/mcp-telegram-worker",
    install: "pip install mcp-telegram-worker",
    category: "Российские",
    tags: ["telegram", "мессенджер", "боты", "чаты"],
  },
  // === DevOps ===
  {
    name: "Kubernetes MCP",
    desc: "Управление Kubernetes кластерами через MCP. Pods, deployments, services, логи.",
    author: "Flux159",
    stars: 1361,
    license: "MIT",
    url: "https://github.com/Flux159/mcp-server-kubernetes",
    install: "npx mcp-server-kubernetes",
    category: "DevOps",
    tags: ["kubernetes", "k8s", "pods", "деплой"],
  },
  {
    name: "Terraform MCP",
    desc: "HashiCorp Terraform через MCP. IaC: планирование, применение, управление инфраструктурой.",
    author: "HashiCorp",
    stars: 1288,
    license: "MPL-2.0",
    url: "https://github.com/hashicorp/terraform-mcp-server",
    install: "npx @hashicorp/terraform-mcp-server",
    category: "DevOps",
    tags: ["terraform", "iac", "инфраструктура"],
  },
  {
    name: "Docker MCP",
    desc: "Управление Docker контейнерами через MCP. Образы, контейнеры, volumes, networks.",
    author: "ckreiling",
    stars: 690,
    license: "MIT",
    url: "https://github.com/ckreiling/mcp-server-docker",
    install: "npx mcp-server-docker",
    category: "DevOps",
    tags: ["docker", "контейнеры", "образы"],
  },
  // === Браузер ===
  {
    name: "Playwright MCP",
    desc: "Управление браузером: навигация, клики, скриншоты, заполнение форм, тестирование.",
    author: "VikashLoomba",
    stars: 282,
    license: "MIT",
    url: "https://github.com/VikashLoomba/MCP-Server-Playwright",
    install: "npx mcp-server-playwright",
    category: "Браузер",
    tags: ["playwright", "браузер", "автоматизация", "тестирование"],
  },
  {
    name: "Puppeteer MCP",
    desc: "Headless Chrome через MCP. Скрапинг, скриншоты, PDF генерация.",
    author: "Community",
    stars: 22,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-puppeteer",
    install: "npx @anthropic-ai/mcp-puppeteer",
    category: "Браузер",
    tags: ["puppeteer", "chrome", "скрапинг", "pdf"],
  },
  // === Базы данных ===
  {
    name: "PostgreSQL MCP",
    desc: "AI-агент + PostgreSQL. SQL запросы, схема, миграции через MCP.",
    author: "Community",
    stars: 0,
    license: "MIT",
    url: "https://github.com/benborge/mcp-server-postgres",
    install: "npx mcp-server-postgres",
    category: "Базы данных",
    tags: ["postgresql", "sql", "запросы"],
  },
  {
    name: "SQLite MCP",
    desc: "MCP сервер для SQLite. Лёгкая БД для локальных проектов.",
    author: "Community",
    stars: 16,
    license: "MIT",
    url: "https://github.com/johnnyoshika/mcp-server-sqlite-npx",
    install: "npx mcp-server-sqlite",
    category: "Базы данных",
    tags: ["sqlite", "sql", "локальная"],
  },
  // === API интеграции ===
  {
    name: "GitHub MCP",
    desc: "Работа с GitHub: репозитории, issues, PR, код, actions.",
    author: "LoamStudios",
    stars: 85,
    license: "MIT",
    url: "https://github.com/LoamStudios/zed-mcp-server-github",
    install: "npx mcp-server-github",
    category: "API интеграции",
    tags: ["github", "git", "issues", "pr"],
  },
  {
    name: "Brave Search MCP",
    desc: "Поиск в интернете через Brave Search API. Веб-поиск для AI-агентов.",
    author: "Community",
    stars: 22,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-brave-search",
    install: "npx @anthropic-ai/mcp-brave-search",
    category: "API интеграции",
    tags: ["поиск", "brave", "веб", "интернет"],
  },
  {
    name: "Fetch MCP",
    desc: "HTTP запросы через MCP. GET/POST к любым API, парсинг ответов.",
    author: "Anthropic",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-fetch",
    install: "npx @anthropic-ai/mcp-fetch",
    category: "API интеграции",
    tags: ["http", "fetch", "api", "запросы"],
  },
  // === Утилиты ===
  {
    name: "Memory MCP",
    desc: "Персистентная память для AI-агента. Хранение контекста между сессиями.",
    author: "Anthropic",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-memory",
    install: "npx @anthropic-ai/mcp-memory",
    category: "Утилиты",
    tags: ["память", "контекст", "сессии"],
  },
  {
    name: "Filesystem MCP",
    desc: "Безопасный доступ к файлам. Чтение, запись, поиск с контролем доступа.",
    author: "Anthropic",
    stars: 5,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-filesystem",
    install: "npx @anthropic-ai/mcp-filesystem",
    category: "Утилиты",
    tags: ["файлы", "filesystem", "чтение", "запись"],
  },
];

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
            href={server.url}
            target="_blank"
            rel="noopener noreferrer"
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
