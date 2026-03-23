import Header from "@/components/Header";

export const metadata = {
  title: "О проекте",
  description: "skillsbd — открытый каталог навыков для AI-агентов",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">О skillsbd</h1>

        <div className="flex flex-col gap-8 text-gray-400">
          <p className="text-lg leading-relaxed">
            <strong className="text-foreground">skillsbd</strong> — это открытый каталог
            переиспользуемых навыков для AI-агентов. Мы помогаем разработчикам находить,
            устанавливать и делиться навыками для Claude Code, Cursor, Copilot и других агентов.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Зачем это нужно?</h2>
            <p>
              AI-агенты становятся мощнее, но их возможности ограничены контекстом. Навыки —
              это способ дать агенту экспертные знания в конкретной области: фреймворки,
              паттерны, лучшие практики, специфика проекта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Как это работает?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Навыки хранятся в GitHub-репозиториях как SKILL.md файлы</li>
              <li>CLI устанавливает навыки в ваш проект одной командой</li>
              <li>AI-агенты автоматически читают установленные навыки</li>
              <li>Каталог помогает найти нужные навыки по категориям и рейтингу</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Открытый проект</h2>
            <p className="mb-3">
              skillsbd — полностью открытый проект. Исходный код доступен на GitHub,
              а любой разработчик может добавить свой навык в каталог.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/vakovalskii/skillsbd-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://t.me/neuraldeep"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
              >
                Telegram
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
