import Header from "@/components/Header";
import { prisma } from "@/lib/db";
import { formatInstalls } from "@/data/skills";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cursor AI Skills — навыки и плагины для Cursor",
  description:
    "Навыки для Cursor AI. Расширяйте возможности Cursor с помощью навыков: Яндекс API, SEO-аналитика, генерация документов. Установка одной командой.",
  keywords: [
    "cursor ai",
    "cursor ai skills",
    "cursor ai навыки",
    "cursor ai плагины",
    "cursor ai в россии",
    "cursor ai расширения",
  ],
};

export default async function CursorAISkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { installs: "desc" },
    take: 12,
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Навыки для Cursor AI
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Cursor — AI-первая IDE с мощным агентом для написания кода.
          Навыки из skillsbd расширяют его знания: работа с Яндекс API,
          российскими сервисами, генерация документов.
        </p>

        <h2 className="text-xl font-semibold mb-4">Как установить навык в Cursor</h2>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm mb-8 space-y-2">
          <p><span className="text-gray-500"># </span>Откройте терминал в Cursor (Ctrl+`)</p>
          <p><span className="text-gray-500">$ </span>npx skillsbd search яндекс</p>
          <p className="mt-2"><span className="text-gray-500"># </span>Установите нужный навык</p>
          <p><span className="text-gray-500">$ </span>npx skillsbd add artwist-polyakov/polyakov-claude-skills/yandex-wordstat</p>
          <p className="mt-2"><span className="text-gray-500"># </span>Навык появится в .skills/ — Cursor подхватит его</p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Доступные навыки</h2>
        <div className="grid gap-3 mb-10">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              href={`/skill/${skill.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
            >
              <div>
                <span className="font-medium">{skill.name}</span>
                {skill.featured && (
                  <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">
                    рекомендован
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

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold mb-3">Cursor AI vs Claude Code</h2>
          <p className="text-gray-400 text-sm">
            Cursor — это IDE с графическим интерфейсом, Claude Code — терминальный агент.
            Навыки из skillsbd работают с обоими: они хранятся как файлы в проекте и
            автоматически читаются любым агентом, который поддерживает формат SKILL.md.
          </p>
        </div>
      </main>
    </>
  );
}
