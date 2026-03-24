import Header from "@/components/Header";

export const metadata = {
  title: "CLI инструменты для AI-агентов",
  description:
    "Инструменты для работы с AI-агентами: openapi-to-cli, skillsbd CLI, create-skillsbd. Мост между API и агентами без MCP-серверов.",
  keywords: [
    "cli tools",
    "openapi-to-cli",
    "skillsbd",
    "ai agents tools",
    "cli для агентов",
    "openapi cli",
  ],
};

const tools = [
  {
    name: "openapi-to-cli",
    desc: "Превращает любой OpenAPI/Swagger API в CLI — одна команда на эндпоинт. Агент вызывает API через CLI без MCP-сервера и сложных интеграций.",
    author: "EvilFreelancer",
    stars: 169,
    license: "MIT",
    lang: "TypeScript",
    url: "https://github.com/EvilFreelancer/openapi-to-cli",
    install: "npm install -g openapi-to-cli",
    usage: `# Генерация CLI из OpenAPI спеки
openapi-to-cli generate --input https://api.example.com/openapi.json --output ./my-api-cli

# Использование сгенерированного CLI
./my-api-cli users-list
./my-api-cli orders-create --body '{"item": "test"}'`,
    why: "Навык (SKILL.md) описывает ЧТО делать. openapi-to-cli даёт агенту КАК вызывать API — без MCP-сервера, без скриптов, без кучи описаний эндпоинтов в SKILL.md. Просто сгенерируй CLI и дай агенту.",
    tags: ["openapi", "swagger", "cli", "api", "генерация"],
  },
  {
    name: "skillsbd",
    desc: "CLI для установки навыков из каталога skillsbd. Поиск, установка, удаление навыков для AI-агентов.",
    author: "vakovalskii",
    stars: 0,
    license: "MIT",
    lang: "JavaScript",
    url: "https://github.com/vakovalskii/skillsbd",
    install: "npx skillsbd --help",
    usage: `# Поиск
npx skillsbd search яндекс

# Установка
npx skillsbd add artwist-polyakov/polyakov-claude-skills/yandex-wordstat

# Список установленных
npx skillsbd list`,
    why: "Основной CLI каталога skillsbd. Устанавливает навыки из GitHub-репозиториев в .skills/ директорию проекта.",
    tags: ["skillsbd", "навыки", "установка", "каталог"],
  },
  {
    name: "create-skillsbd",
    desc: "Генератор корпоративных skill-библиотек. Создаёт готовый npm-пакет с CLI для распространения навыков внутри компании.",
    author: "vakovalskii",
    stars: 0,
    license: "MIT",
    lang: "JavaScript",
    url: "https://github.com/vakovalskii/skillsbd/tree/main/create-skillsbd",
    install: "npx create-skillsbd my-company-skills",
    usage: `# Создать библиотеку
npx create-skillsbd my-company-skills
cd my-company-skills

# Добавить навыки в skills/
# Опубликовать
npm publish --access public`,
    why: "Для компаний, которые хотят распространять навыки внутри команды через npm (публичный или приватный реестр).",
    tags: ["генератор", "корпоративный", "npm", "библиотека"],
  },
];

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">CLI инструменты</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Инструменты, которые делают AI-агентов полезнее.
          Навыки описывают знания, CLI инструменты дают действия.
        </p>

        <div className="flex flex-col gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden hover-glow transition-all"
            >
              <div className="p-5">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h2 className="text-xl font-semibold">{tool.name}</h2>
                  {tool.stars > 0 && (
                    <span className="text-xs text-yellow-500/70 font-mono">★{tool.stars}</span>
                  )}
                  <span className="text-xs text-gray-600">{tool.license}</span>
                  <span className="text-xs text-gray-600">{tool.lang}</span>
                  <span className="text-xs text-gray-500">by {tool.author}</span>
                </div>

                <p className="text-gray-400 text-sm mb-4">{tool.desc}</p>

                <div className="rounded-md bg-gray-950 border border-gray-800 p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Установка:</p>
                  <code className="text-sm text-accent">{tool.install}</code>
                </div>

                <div className="rounded-md bg-gray-950 border border-gray-800 p-3 mb-4 overflow-x-auto">
                  <p className="text-xs text-gray-500 mb-2">Использование:</p>
                  <pre className="text-xs text-gray-400 whitespace-pre">{tool.usage}</pre>
                </div>

                <div className="rounded-md border border-accent/20 bg-accent/5 p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Зачем для агентов:</p>
                  <p className="text-sm text-gray-300">{tool.why}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-gray-800 px-2 py-0.5 text-xs text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto rounded-md border border-gray-800 px-3 py-1 text-xs text-gray-400 hover:border-gray-600 hover:text-foreground transition-colors"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="font-semibold mb-3">Как это работает вместе</h2>
          <div className="text-sm text-gray-400 space-y-2 font-mono">
            <p className="text-gray-500"># 1. Установи навык с знаниями</p>
            <p>npx skillsbd add owner/repo/yandex-wordstat</p>
            <p className="text-gray-500 mt-3"># 2. Сгенерируй CLI из API</p>
            <p>openapi-to-cli generate --input yandex-api.yaml --output ./yandex-cli</p>
            <p className="text-gray-500 mt-3"># 3. Агент знает ЧТО делать (навык) и КАК делать (CLI)</p>
            <p className="text-green-400/70">→ Claude Code читает .skills/yandex-wordstat/SKILL.md</p>
            <p className="text-green-400/70">→ Вызывает ./yandex-cli wordstat-search --query "ключевое слово"</p>
          </div>
        </div>
      </main>
    </>
  );
}
