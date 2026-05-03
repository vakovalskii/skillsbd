import Link from "next/link";

export default function SkillsCallout({ totalSkills }: { totalSkills?: number }) {
  return (
    <section id="skills-callout" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">
                / community
              </p>
              <h2 className="text-xl font-bold sm:text-2xl mb-3">
                А ещё мы ведём open-source каталог скилов и MCP для RU-комьюнити
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed sm:text-base mb-4">
                <span className="font-mono text-foreground">skillsbd</span> — российский
                агрегатор для AI-агентов: Яндекс, 1С, Битрикс, GigaChat, Wildberries.
                Поддерживает Claude Code, Cursor, Codex, Windsurf и российские агенты
                (GigaCode, Koda, SourceCraft).
                {totalSkills ? (
                  <>
                    {" "}В каталоге уже{" "}
                    <span className="text-foreground font-semibold">{totalSkills}+</span>{" "}
                    инструментов.
                  </>
                ) : null}
              </p>
              <div className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-xs w-fit">
                <span className="text-gray-500">$</span>
                <span className="text-foreground">npx skillsbd add</span>
                <span className="text-gray-500">&lt;owner/repo&gt;</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:items-end lg:min-w-[200px]">
              <Link
                href="/skills"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
              >
                Открыть каталог →
              </Link>
              <a
                href="https://github.com/vakovalskii/neuraldeep"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-700 bg-gray-900 px-5 py-2.5 text-sm text-gray-400 hover:text-foreground hover:border-gray-600 transition-colors"
              >
                GitHub
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
