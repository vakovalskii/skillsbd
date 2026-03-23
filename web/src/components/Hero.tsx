export default function Hero() {
  const agents = [
    "Claude Code",
    "Cursor",
    "Copilot",
    "Windsurf",
    "Cline",
    "Codex",
    "Gemini",
    "VSCode",
    "Roo",
    "Goose",
    "OpenCode",
    "Trae",
  ];

  return (
    <div className="flex flex-col gap-4 py-6 sm:gap-6 sm:py-8 lg:py-12">
      <div className="flex items-baseline gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          skills<span className="text-accent">БД</span>
        </h1>
        <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
          beta
        </span>
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
        Российский каталог навыков для AI-агентов
      </p>

      <p className="max-w-md text-[15px] leading-relaxed text-gray-400 lg:text-base">
        Навыки для работы с Яндекс, Битрикс, 1С и другими российскими сервисами.
        Устанавливайте одной командой, делитесь с RU-комьюнити.
      </p>

      <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 font-mono text-sm w-fit">
        <span className="text-gray-500">$</span>
        <span className="text-foreground">
          npx skillsbd add <span className="text-gray-500">&lt;owner/repo&gt;</span>
        </span>
      </div>

      <div className="mt-2">
        <p className="mb-3 text-xs text-gray-600">Поддерживаемые агенты:</p>
        <div className="flex flex-wrap gap-2">
          {agents.map((agent) => (
            <span
              key={agent}
              className="rounded-md border border-gray-800 bg-gray-900 px-2.5 py-1 text-xs text-gray-400"
            >
              {agent}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
