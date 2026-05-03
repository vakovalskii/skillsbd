type Repo = {
  name: string;
  description: string;
  stars: number;
  language: string;
  langColor: string;
};

// Хардкод чтобы не зависеть от GitHub API rate limits.
// Источник: github.com/vakovalskii (snapshot 2026-05-03).
const repos: Repo[] = [
  {
    name: "KVDesk",
    description:
      "Versatile Almost Local, Eventually Reasonable Assistant — локальный AI-ассистент с виджетами и MCP.",
    stars: 326,
    language: "TypeScript",
    langColor: "#3178c6",
  },
  {
    name: "searcharvester",
    description:
      "Self-hosted поиск + markdown harvester для AI-агентов. SearXNG + FastAPI + trafilatura. Tavily-совместимый.",
    stars: 213,
    language: "Python",
    langColor: "#3572A5",
  },
  {
    name: "codbash",
    description:
      "Termius-style браузерный дашборд для Claude Code и Codex сессий. Просмотр, поиск, теги, resume.",
    stars: 201,
    language: "JavaScript",
    langColor: "#f1e05a",
  },
  {
    name: "topsha",
    description:
      "Local Topsha AI-агент для простых PC-задач — на локальных LLM (gpt-oss, Qwen, GLM).",
    stars: 147,
    language: "Python",
    langColor: "#3572A5",
  },
  {
    name: "whisperx-fronted-docker-compose",
    description:
      "WhisperX с UI и docker-compose. Слова с таймстампами, диаризация, RU/EN — out of the box.",
    stars: 66,
    language: "JavaScript",
    langColor: "#f1e05a",
  },
  {
    name: "LocalTaskClaw",
    description:
      "Personal AI-агент. Деплой в 3 шага на любой Linux-сервер. Минимум зависимостей, максимум контроля.",
    stars: 34,
    language: "Python",
    langColor: "#3572A5",
  },
];

export default function OssShowcase() {
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);

  return (
    <section id="oss" className="border-b border-gray-800 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
              / open source
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Что мы выкладываем в open source
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {totalStars}+ звёзд на GitHub. Это инструменты, которыми мы сами пользуемся каждый день.
            </p>
          </div>
          <a
            href="https://github.com/vakovalskii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-400 hover:text-foreground hover:border-gray-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            github.com/vakovalskii →
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r) => (
            <a
              key={r.name}
              href={`https://github.com/vakovalskii/${r.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-lg border border-gray-800 bg-gray-900/30 p-4 transition-all hover:border-gray-700 hover:bg-gray-900/60"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                  {r.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                  {r.stars}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-3 flex-1">
                {r.description}
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: r.langColor }}
                />
                <span className="text-gray-500">{r.language}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
