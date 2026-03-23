import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Claude Code в России — как использовать, навыки, настройка",
  description:
    "Как использовать Claude Code в России. Навыки для работы с Яндекс Wordstat, Вебмастер, Метрика. Установка, настройка, плагины для российских разработчиков.",
  keywords: [
    "claude code в россии",
    "claude code как использовать",
    "claude code как использовать в россии",
    "claude code установка",
    "claude code как пользоваться",
    "claude code навыки россия",
  ],
};

export default function ClaudeCodeRussiaPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Claude Code в России
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Как использовать Claude Code для работы с российскими сервисами
          и где найти навыки на русском языке.
        </p>

        <div className="flex flex-col gap-8 text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Что такое Claude Code?</h2>
            <p>
              Claude Code — это AI-агент от Anthropic для написания кода прямо в терминале.
              Он понимает контекст проекта, работает с файлами, запускает команды и помогает
              с любыми задачами разработки.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Навыки для российских сервисов</h2>
            <p className="mb-4">
              В каталоге skillsbd собраны навыки для работы с популярными российскими сервисами:
            </p>
            <div className="grid gap-3">
              {[
                { name: "Яндекс Wordstat", desc: "Анализ поискового спроса через Wordstat API", link: "/official" },
                { name: "Яндекс Вебмастер", desc: "Управление сайтами, индексация, поисковые запросы", link: "/official" },
                { name: "Яндекс Метрика", desc: "Аналитика: трафик, конверсии, UTM-метки", link: "/official" },
                { name: "Яндекс Поиск API", desc: "Парсинг выдачи Яндекса через Search API v2", link: "/official" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Как установить навык</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm space-y-2">
              <p><span className="text-gray-500"># </span>Установите CLI</p>
              <p><span className="text-gray-500">$ </span>npx skillsbd search яндекс</p>
              <p className="mt-3"><span className="text-gray-500"># </span>Установите навык</p>
              <p><span className="text-gray-500">$ </span>npx skillsbd add artwist-polyakov/polyakov-claude-skills/yandex-wordstat</p>
              <p className="mt-3"><span className="text-gray-500"># </span>Готово! Claude Code подхватит навык автоматически</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Зачем нужен skillsbd?</h2>
            <p>
              Глобальные каталоги навыков (skills.sh) ориентированы на англоязычный рынок.
              В skillsbd собираем навыки для российских разработчиков: Яндекс, Битрикс, 1С,
              ВКонтакте, Telegram — всё, что нужно для работы в РФ.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Поддерживаемые агенты</h2>
            <p>
              Навыки из skillsbd работают не только с Claude Code. Они совместимы с Cursor,
              Copilot, Windsurf, Cline, Codex, Gemini и другими AI-агентами, которые
              поддерживают формат SKILL.md.
            </p>
          </section>
        </div>

        <div className="mt-10 flex gap-3">
          <Link
            href="/"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Каталог навыков
          </Link>
          <Link
            href="/docs"
            className="rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
          >
            Документация
          </Link>
        </div>
      </main>
    </>
  );
}
