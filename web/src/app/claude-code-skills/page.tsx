import Header from "@/components/Header";
import { prisma } from "@/lib/db";
import { formatInstalls } from "@/data/skills";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Claude Code Skills — навыки и плагины для Claude Code",
  description:
    "Каталог навыков (skills) для Claude Code. Устанавливайте плагины одной командой: Яндекс Wordstat, Вебмастер, SEO, генерация изображений и другие. Работает в России.",
  keywords: [
    "claude code skills",
    "claude code plugins",
    "claude code навыки",
    "claude code плагины",
    "claude code расширения",
    "claude code агенты",
    "skills for claude code",
  ],
};

export default async function ClaudeCodeSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { installs: "desc" },
    take: 20,
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Claude Code Skills — навыки для Claude Code
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Навыки (skills) расширяют возможности Claude Code. Каждый навык — это набор
          инструкций, который делает агента экспертом в конкретной области: работа с
          Яндекс API, генерация документов, SEO-аналитика и многое другое.
        </p>

        <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 font-mono text-sm mb-8 w-fit">
          <span className="text-gray-500">$ </span>
          npx skillsbd add owner/repo/skill-name
        </div>

        <h2 className="text-xl font-semibold mb-4">Как установить навык в Claude Code</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-400 mb-10">
          <li>Откройте терминал в папке вашего проекта</li>
          <li>Выполните <code className="text-accent bg-gray-900 px-1 rounded">npx skillsbd add owner/repo/skill</code></li>
          <li>Навык появится в директории <code className="text-accent bg-gray-900 px-1 rounded">.skills/</code></li>
          <li>Claude Code автоматически прочитает его при следующем запуске</li>
        </ol>

        <h2 className="text-xl font-semibold mb-4">Популярные навыки для Claude Code</h2>
        <div className="grid gap-3">
          {skills.map((skill, i) => (
            <Link
              key={skill.id}
              href={`/skill/${skill.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9а-яё\-]/gi, '')}`}
              className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
            >
              <div>
                <span className="font-medium">{skill.name}</span>
                {skill.featured && (
                  <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">
                    выбор редакции
                  </span>
                )}
                <p className="text-sm text-gray-500 mt-1">{skill.description}</p>
              </div>
              <span className="text-sm text-gray-600 font-mono shrink-0 ml-4">
                {formatInstalls(skill.installs)}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold mb-3">Что такое Claude Code Skills?</h2>
          <div className="space-y-3 text-gray-400 text-sm">
            <p>
              <strong className="text-foreground">Skills</strong> (навыки) — это файлы SKILL.md,
              которые содержат инструкции для AI-агента. Когда вы устанавливаете навык,
              Claude Code получает экспертные знания в конкретной области.
            </p>
            <p>
              В отличие от MCP-серверов, навыки не требуют запуска дополнительных процессов.
              Это чистые текстовые инструкции, которые агент читает из директории проекта.
            </p>
            <p>
              <strong className="text-foreground">skillsbd</strong> — российский каталог навыков
              с фокусом на Яндекс, Битрикс, 1С и другие сервисы, востребованные в РФ.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
