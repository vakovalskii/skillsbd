"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface Tool {
  name: string;
  desc: string;
  author: string;
  stars: number;
  license: string;
  lang: string;
  url: string;
  install: string;
  ru?: boolean;
  category: string;
  tags: string[];
}

const tools: Tool[] = [
  {
    name: "openapi-to-cli",
    desc: "OpenAPI/Swagger → CLI. Одна команда на эндпоинт. Агент вызывает API без MCP-сервера.",
    author: "EvilFreelancer",
    stars: 169,
    license: "MIT",
    lang: "TypeScript",
    url: "https://github.com/EvilFreelancer/openapi-to-cli",
    install: "npm install -g openapi-to-cli",
    category: "CLI генераторы",
    tags: ["openapi", "swagger", "cli", "api", "генерация"],
  },
  {
    name: "skillsbd",
    desc: "Установка навыков из каталога skillsbd. Поиск, установка, удаление навыков для AI-агентов.",
    author: "vakovalskii",
    stars: 0,
    license: "MIT",
    lang: "JavaScript",
    url: "https://github.com/vakovalskii/skillsbd",
    install: "npx skillsbd --help",
    ru: true,
    category: "Управление навыками",
    tags: ["skillsbd", "навыки", "установка", "каталог"],
  },
  {
    name: "create-skillsbd",
    desc: "Генератор корпоративных skill-библиотек. Готовый npm-пакет для распространения навыков в компании.",
    author: "vakovalskii",
    stars: 0,
    license: "MIT",
    lang: "JavaScript",
    url: "https://github.com/vakovalskii/skillsbd/tree/main/create-skillsbd",
    install: "npx create-skillsbd my-company-skills",
    ru: true,
    category: "Управление навыками",
    tags: ["генератор", "корпоративный", "npm", "библиотека"],
  },
  {
    name: "Gemini CLI",
    desc: "AI-агент от Google в терминале. Мощь Gemini прямо в командной строке. Open-source.",
    author: "Google",
    stars: 98913,
    license: "Apache-2.0",
    lang: "TypeScript",
    url: "https://github.com/google-gemini/gemini-cli",
    install: "npm install -g @anthropic-ai/gemini-cli",
    category: "AI агенты",
    tags: ["gemini", "google", "терминал", "агент"],
  },
  {
    name: "OpenHands",
    desc: "AI-driven разработка. Автономный агент: пишет код, запускает тесты, взаимодействует с GitHub.",
    author: "All-Hands-AI",
    stars: 69662,
    license: "MIT",
    lang: "Python",
    url: "https://github.com/All-Hands-AI/OpenHands",
    install: "pip install openhands",
    category: "AI агенты",
    tags: ["openhands", "автономный", "python", "github"],
  },
  {
    name: "Codex CLI",
    desc: "Легковесный AI-агент от OpenAI для терминала. Пишет и исполняет код по описанию на естественном языке.",
    author: "OpenAI",
    stars: 67292,
    license: "Apache-2.0",
    lang: "TypeScript",
    url: "https://github.com/openai/codex",
    install: "npm install -g @openai/codex",
    category: "AI агенты",
    tags: ["codex", "openai", "терминал", "агент"],
  },
  {
    name: "Cline",
    desc: "Автономный AI-агент в VS Code. Создаёт/редактирует файлы, запускает команды, работает с браузером.",
    author: "cline",
    stars: 59304,
    license: "Apache-2.0",
    lang: "TypeScript",
    url: "https://github.com/cline/cline",
    install: "VS Code Marketplace: Cline",
    category: "AI агенты",
    tags: ["cline", "vscode", "автономный", "браузер"],
  },
  {
    name: "Goose",
    desc: "Open-source AI-агент от Block. Установка, запуск, тестирование — не только код. Работает с любыми LLM.",
    author: "Block",
    stars: 33513,
    license: "Apache-2.0",
    lang: "Rust",
    url: "https://github.com/block/goose",
    install: "brew install block/tap/goose",
    category: "AI агенты",
    tags: ["goose", "rust", "агент", "block", "mcp"],
  },
  {
    name: "Tabby",
    desc: "Self-hosted AI-ассистент для кода. Автокомплит, чат. Запускается на своём GPU, данные не уходят наружу.",
    author: "TabbyML",
    stars: 33045,
    license: "Apache-2.0",
    lang: "Rust",
    url: "https://github.com/TabbyML/tabby",
    install: "docker run tabbyml/tabby serve --model ...",
    category: "AI агенты",
    tags: ["tabby", "self-hosted", "автокомплит", "gpu"],
  },
  {
    name: "Devika",
    desc: "Open-source аналог Devin — автономный AI software engineer. Планирует, ищет, пишет код.",
    author: "stitionai",
    stars: 19499,
    license: "MIT",
    lang: "Python",
    url: "https://github.com/stitionai/devika",
    install: "git clone && pip install -r requirements.txt",
    category: "AI агенты",
    tags: ["devika", "devin", "автономный", "python"],
  },
  {
    name: "Plandex",
    desc: "AI-агент для больших проектов. Разбивает задачу на шаги, работает с множеством файлов, песочница.",
    author: "plandex-ai",
    stars: 15135,
    license: "AGPL-3.0",
    lang: "Go",
    url: "https://github.com/plandex-ai/plandex",
    install: "curl -sL https://plandex.ai/install.sh | bash",
    category: "AI агенты",
    tags: ["plandex", "планирование", "go", "песочница"],
  },
  {
    name: "OpenCode",
    desc: "AI-кодинг агент для терминала на Go. Быстрый, минималистичный, множество LLM провайдеров.",
    author: "opencode-ai",
    stars: 11561,
    license: "MIT",
    lang: "Go",
    url: "https://github.com/opencode-ai/opencode",
    install: "go install github.com/opencode-ai/opencode@latest",
    category: "AI агенты",
    tags: ["терминал", "go", "агент", "opencode"],
  },
  {
    name: "PR-Agent",
    desc: "AI-ревью PR на GitHub/GitLab. Автоматический анализ, предложения, генерация описания PR.",
    author: "Qodo",
    stars: 10654,
    license: "Apache-2.0",
    lang: "Python",
    url: "https://github.com/qodo-ai/pr-agent",
    install: "pip install pr-agent",
    category: "AI агенты",
    tags: ["pr-review", "github", "gitlab", "автоматизация"],
  },
  {
    name: "Aider",
    desc: "AI pair programming в терминале. Работает с git, понимает diff, поддерживает множество LLM.",
    author: "paul-gauthier",
    stars: 0,
    license: "Apache-2.0",
    lang: "Python",
    url: "https://github.com/paul-gauthier/aider",
    install: "pip install aider-chat",
    category: "AI агенты",
    tags: ["aider", "pair programming", "git", "python"],
  },
  {
    name: "Continue.dev",
    desc: "Open-source AI-ассистент для IDE. Автокомплит, чат, BYOK. Подключается к любым LLM.",
    author: "continuedev",
    stars: 0,
    license: "Apache-2.0",
    lang: "TypeScript",
    url: "https://github.com/continuedev/continue",
    install: "VS Code / JetBrains Marketplace",
    category: "AI агенты",
    tags: ["vscode", "jetbrains", "byok", "автокомплит"],
  },
  {
    name: "Roo Code",
    desc: "AI-агент для VS Code. Автономное редактирование, запуск команд, работа с браузером.",
    author: "RooVetGit",
    stars: 0,
    license: "Apache-2.0",
    lang: "TypeScript",
    url: "https://github.com/RooVetGit/Roo-Code",
    install: "VS Code Marketplace: Roo Code",
    category: "AI агенты",
    tags: ["vscode", "агент", "ide", "расширение"],
  },
  {
    name: "AIDE",
    desc: "AI-расширение для VS Code: комментарии в клик, конвертация кода, UI → код, пакетная обработка.",
    author: "nicepkg",
    stars: 2692,
    license: "MIT",
    lang: "TypeScript",
    url: "https://github.com/nicepkg/aide",
    install: "VS Code Marketplace: AIDE",
    category: "AI агенты",
    tags: ["vscode", "комментарии", "конвертация", "ui-to-code"],
  },
  {
    name: "Coddy Agent",
    desc: "Open-source ReAct AI-агент на Go с TUI. Совместим с Cursor и Zed. Поддерживает SKILLS и MCP.",
    author: "coddy-project",
    stars: 3,
    license: "MIT",
    lang: "Go",
    url: "https://github.com/coddy-project/coddy-agent",
    install: "go install github.com/coddy-project/coddy-agent@latest",
    category: "AI агенты",
    tags: ["go", "tui", "react", "acp", "skills", "mcp"],
  },
];

export default function ToolsGrid() {
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(() =>
    searchParams.get("filter") === "russian" ? "__ru__" : ""
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
    const cats = new Set(tools.map((t) => t.category));
    return Array.from(cats).sort();
  }, []);

  const ruCount = tools.filter((t) => t.ru).length;

  const filtered = useMemo(() => {
    let list = tools;
    if (activeCategory === "__ru__") {
      list = list.filter((t) => t.ru);
    } else if (activeCategory) {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.author.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory]);

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Поиск инструментов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-foreground placeholder:text-gray-600 outline-none focus:border-gray-600 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500">
          ⌘K
        </kbd>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory("")}
          className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
            !activeCategory
              ? "bg-accent/15 text-accent border border-accent/30"
              : "border border-gray-800 text-gray-500 hover:text-gray-400"
          }`}
        >
          Все ({tools.length})
        </button>
        {ruCount > 0 && (
          <button
            onClick={() => setActiveCategory(activeCategory === "__ru__" ? "" : "__ru__")}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              activeCategory === "__ru__"
                ? "bg-red-900/30 text-red-400 border border-red-800/40"
                : "border border-gray-800 text-gray-500 hover:text-gray-400"
            }`}
          >
            Российские ({ruCount})
          </button>
        )}
        {categories.map((cat) => {
          const count = tools.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? "" : cat)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                activeCategory === cat
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "border border-gray-800 text-gray-500 hover:text-gray-400"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filtered.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 hover-glow card-shine transition-all group"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {tool.name}
              </h3>
              {tool.ru && (
                <span className="rounded bg-red-900/30 border border-red-800/40 px-1.5 py-0.5 text-[10px] font-bold text-red-400">RU</span>
              )}
              {tool.stars > 0 && (
                <span className="text-xs text-yellow-500/70 font-mono">★{tool.stars}</span>
              )}
            </div>

            <p className="text-xs text-gray-400 flex-1 mb-3 line-clamp-3">{tool.desc}</p>

            <div className="rounded-md bg-gray-950 border border-gray-800 px-2 py-1.5 mb-3">
              <code className="text-[11px] text-accent break-all">{tool.install}</code>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                <span className="text-[10px] text-gray-600">{tool.author}</span>
                <span className="text-[10px] text-gray-700">·</span>
                <span className="text-[10px] text-gray-600">{tool.lang}</span>
              </div>
              <span className="text-[10px] text-gray-700">{tool.license}</span>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-600 py-8">Инструменты не найдены</p>
      )}
    </div>
  );
}
