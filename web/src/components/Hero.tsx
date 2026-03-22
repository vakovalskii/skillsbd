export default function Hero() {
  const asciiArt = `
 ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
 ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
 ███████╗█████╔╝ ██║██║     ██║     ███████╗
 ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
 ███████║██║  ██╗██║███████╗███████╗███████║
 ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`.trim();

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
    <div className="flex flex-col gap-6 py-8 lg:py-12">
      <pre className="font-mono text-[8px] leading-[1.1] text-accent sm:text-[10px] lg:text-xs select-none">
        {asciiArt}
      </pre>

      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
        Открытая экосистема навыков для AI-агентов
      </p>

      <p className="max-w-md text-[15px] leading-relaxed text-gray-400 lg:text-base">
        Навыки — это переиспользуемые возможности для AI-агентов. Установите
        их одной командой, чтобы расширить знания ваших агентов.
      </p>

      <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 font-mono text-sm w-fit">
        <span className="text-gray-500">$</span>
        <span className="text-foreground">
          npx skillsru add <span className="text-gray-500">&lt;owner/repo&gt;</span>
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
