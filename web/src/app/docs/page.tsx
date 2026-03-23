import Header from "@/components/Header";

export const metadata = {
  title: "Документация",
  description: "Как создавать и использовать навыки для AI-агентов",
};

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Документация</h1>

        <div className="prose-custom flex flex-col gap-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">Быстрый старт</h2>
            <p className="text-gray-400 mb-4">
              Установите навык одной командой:
            </p>
            <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 font-mono text-sm">
              <span className="text-gray-500">$ </span>
              <span>npx skillsbd add owner/repo</span>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Что такое навык?</h2>
            <p className="text-gray-400 mb-3">
              Навык — это файл <code className="text-accent bg-gray-900 px-1.5 py-0.5 rounded text-sm">SKILL.md</code>,
              который описывает возможности AI-агента. Агенты (Claude Code, Cursor, Copilot и другие)
              читают этот файл и используют описанные в нём инструкции.
            </p>
            <p className="text-gray-400">
              Навыки хранятся в GitHub-репозиториях и устанавливаются в директорию{" "}
              <code className="text-accent bg-gray-900 px-1.5 py-0.5 rounded text-sm">.skills/</code>{" "}
              вашего проекта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Структура репозитория</h2>
            <p className="text-gray-400 mb-4">
              Репозиторий с навыками может иметь одну из двух структур:
            </p>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-400">
              <p className="text-gray-500 mb-2"># Один навык в корне</p>
              <p>repo/</p>
              <p className="ml-4">SKILL.md</p>
              <p className="mt-4 text-gray-500"># Несколько навыков</p>
              <p>repo/</p>
              <p className="ml-4">skills/</p>
              <p className="ml-8">react-best-practices/</p>
              <p className="ml-12">SKILL.md</p>
              <p className="ml-8">typescript-patterns/</p>
              <p className="ml-12">SKILL.md</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Команды CLI</h2>
            <div className="flex flex-col gap-3">
              {[
                { cmd: "npx skillsbd add <owner/repo>", desc: "Установить все навыки из репозитория" },
                { cmd: "npx skillsbd add <owner/repo/skill>", desc: "Установить конкретный навык" },
                { cmd: "npx skillsbd list", desc: "Показать установленные навыки" },
                { cmd: "npx skillsbd search <запрос>", desc: "Поиск навыков в каталоге" },
                { cmd: "npx skillsbd remove <skill>", desc: "Удалить навык" },
              ].map(({ cmd, desc }) => (
                <div key={cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <code className="font-mono text-sm text-accent">{cmd}</code>
                  <span className="text-sm text-gray-500">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Формат SKILL.md</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-400">
              <p>---</p>
              <p>name: react-best-practices</p>
              <p>description: Лучшие практики React</p>
              <p>author: vakovalskii</p>
              <p>tags: [react, frontend]</p>
              <p>---</p>
              <p className="mt-2"># React Best Practices</p>
              <p className="mt-2">Инструкции для AI-агента...</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">API для разработчиков</h2>
            <p className="text-gray-400 mb-3">
              Открытый API для интеграции с AI-агентами и собственными инструментами.
              Авторизация не требуется для GET-запросов.
            </p>
            <a href="/docs/api" className="text-accent hover:underline">Полная документация API →</a>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Как добавить свой навык</h2>
            <ol className="list-decimal list-inside flex flex-col gap-2 text-gray-400">
              <li>Создайте GitHub-репозиторий с файлом SKILL.md</li>
              <li>Перейдите на страницу <a href="/submit" className="text-accent hover:underline">Добавить навык</a></li>
              <li>Заполните форму и отправьте на модерацию</li>
              <li>После проверки навык появится в каталоге</li>
            </ol>
          </section>
        </div>
      </main>
    </>
  );
}
