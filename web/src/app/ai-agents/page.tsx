import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "AI агенты — навыки и плагины для программирования",
  description:
    "Каталог навыков для AI агентов: Claude Code, Cursor, Copilot, Windsurf. Работа с Яндекс API, генерация документов, SEO-аналитика. Российское комьюнити.",
  keywords: [
    "ai агенты",
    "ai агент",
    "создание ai агентов",
    "ai агенты для бизнеса",
    "лучшие ai агенты",
    "ai агенты 2026",
    "ai агент яндекс",
    "нейросеть программирование",
  ],
};

const agents = [
  {
    name: "Claude Code",
    desc: "AI-агент от Anthropic. Работает в терминале, понимает контекст проекта, пишет и правит код.",
    queries: "61 928 запросов/мес",
  },
  {
    name: "Cursor",
    desc: "AI-первая IDE на базе VS Code. Встроенный агент для написания кода и рефакторинга.",
    queries: "20 156 запросов/мес",
  },
  {
    name: "GitHub Copilot",
    desc: "AI-ассистент от GitHub/Microsoft. Автодополнение кода и генерация по описанию.",
    queries: "15 000+ запросов/мес",
  },
  {
    name: "Windsurf",
    desc: "AI IDE от Codeium. Продвинутый агент для работы с кодовой базой целиком.",
    queries: "",
  },
  {
    name: "Codex",
    desc: "AI-агент от OpenAI. Запускает задачи в облачном песочнице.",
    queries: "",
  },
  {
    name: "Cline",
    desc: "Открытый AI-агент для VS Code. Работает с любыми LLM-провайдерами.",
    queries: "",
  },
];

export default function AIAgentsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          AI агенты для программирования
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          AI-агенты — это инструменты, которые помогают разработчикам писать код,
          находить баги и автоматизировать рутину. Навыки (skills) расширяют их
          возможности для работы с конкретными сервисами и задачами.
        </p>

        <h2 className="text-xl font-semibold mb-4">Популярные AI-агенты</h2>
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="rounded-lg border border-gray-800 bg-gray-900 p-4"
            >
              <h3 className="font-medium text-foreground">{agent.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{agent.desc}</p>
              {agent.queries && (
                <p className="text-xs text-gray-600 mt-2 font-mono">{agent.queries}</p>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Как навыки усиливают AI-агентов</h2>
        <div className="space-y-4 text-gray-400 mb-10">
          <p>
            Без навыков AI-агент знает только то, что было в его обучении.
            С навыками он получает актуальные инструкции: как работать с API Яндекса,
            как заполнять шаблоны договоров, как анализировать поисковый спрос.
          </p>
          <p>
            Навыки — это файлы <code className="text-accent bg-gray-900 px-1 rounded">SKILL.md</code>,
            которые устанавливаются в проект одной командой и автоматически читаются агентом.
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Навыки для российских сервисов</h2>
        <p className="text-gray-400 mb-4">
          В каталоге skillsbd собраны навыки с фокусом на РФ: Яндекс Wordstat,
          Яндекс Вебмастер, Метрика, Telegraph, генерация документов и другие.
        </p>

        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Открыть каталог
          </Link>
          <Link
            href="/claude-code-skills"
            className="rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
          >
            Навыки для Claude Code
          </Link>
        </div>
      </main>
    </>
  );
}
