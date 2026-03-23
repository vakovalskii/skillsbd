import Header from "@/components/Header";

export const metadata = {
  title: "API документация",
  description: "Открытый API каталога skillsbd для AI-агентов и разработчиков",
};

const endpoints = [
  {
    method: "GET",
    path: "/api/skills",
    desc: "Список всех навыков из каталога",
    params: [
      { name: "q", desc: "Поиск по названию, описанию или автору", example: "?q=яндекс" },
      { name: "sort", desc: "Сортировка: all (по установкам) или trending (за 24ч)", example: "?sort=trending" },
    ],
    response: `[
  {
    "id": "cm...",
    "name": "yandex-wordstat",
    "owner": "artwist-polyakov",
    "repo": "polyakov-claude-skills",
    "description": "Анализ поискового спроса через Яндекс Wordstat API",
    "installs": 3201,
    "trending24h": 180,
    "category": "контент",
    "tags": ["яндекс", "wordstat", "seo"],
    "authorName": "Polyakov",
    "telegramLink": "https://t.me/countwithsasha",
    "featured": true
  }
]`,
  },
  {
    method: "GET",
    path: "/api/skills/readme",
    desc: "Получить содержимое SKILL.md навыка из GitHub",
    params: [
      { name: "skillId", desc: "ID навыка из каталога", example: "?skillId=cm..." },
    ],
    response: `{
  "content": "# Yandex Wordstat\\n\\nАнализ поискового спроса...",
  "path": "plugins/yandex-wordstat/skills/yandex-wordstat/SKILL.md"
}`,
  },
  {
    method: "GET",
    path: "/api/skills/audit",
    desc: "Результаты аудита безопасности навыка",
    params: [
      { name: "skillId", desc: "ID навыка", example: "?skillId=cm..." },
    ],
    response: `[
  { "checkName": "repository", "status": "pass", "details": "Публичный репозиторий, 45 звёзд" },
  { "checkName": "license", "status": "pass", "details": "Лицензия: MIT" },
  { "checkName": "security", "status": "pass", "details": "SKILL.md проверен, опасных команд не найдено" }
]`,
  },
  {
    method: "POST",
    path: "/api/skills/install",
    desc: "Трекинг установки навыка (вызывается CLI автоматически)",
    params: [],
    response: `// Request body:
{ "name": "yandex-wordstat", "owner": "artwist-polyakov", "repo": "polyakov-claude-skills", "v": "0.3.1" }

// Response:
{ "tracked": true, "installs": 3202 }`,
  },
];

export default function APIDocsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">API документация</h1>
        <p className="text-gray-400 text-lg mb-4">
          Открытый API для AI-агентов и разработчиков.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Базовый URL: <code className="text-accent bg-gray-900 px-1.5 py-0.5 rounded">https://skillsbd.ru</code>
          — авторизация не требуется для GET-запросов.
        </p>

        <div className="flex flex-col gap-8">
          {endpoints.map((ep) => (
            <div key={ep.path + ep.method} className="rounded-lg border border-gray-800 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                  ep.method === "GET" ? "bg-green-900/50 text-green-400" : "bg-blue-900/50 text-blue-400"
                }`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono">{ep.path}</code>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-4">{ep.desc}</p>

                {ep.params.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Параметры</h4>
                    <div className="space-y-2">
                      {ep.params.map((p) => (
                        <div key={p.name} className="flex items-start gap-2 text-sm">
                          <code className="text-accent bg-gray-900 px-1 rounded shrink-0">{p.name}</code>
                          <span className="text-gray-500">{p.desc}</span>
                          <code className="text-gray-600 text-xs ml-auto shrink-0">{p.example}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Ответ</h4>
                  <pre className="rounded-lg bg-gray-900 p-3 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre">
                    {ep.response}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold mb-3">Примеры использования</h2>
          <div className="space-y-4 text-sm font-mono text-gray-400">
            <div>
              <p className="text-gray-500 mb-1"># Поиск навыков по ключевому слову</p>
              <p>curl https://skillsbd.ru/api/skills?q=яндекс</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1"># Топ навыков по установкам</p>
              <p>curl https://skillsbd.ru/api/skills</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1"># Тренды за 24 часа</p>
              <p>curl https://skillsbd.ru/api/skills?sort=trending</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1"># Получить SKILL.md навыка</p>
              <p>curl &quot;https://skillsbd.ru/api/skills/readme?skillId=ID&quot;</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1"># Из Python</p>
              <p className="text-gray-400">import requests</p>
              <p className="text-gray-400">skills = requests.get(&quot;https://skillsbd.ru/api/skills?q=seo&quot;).json()</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1"># Из JavaScript</p>
              <p className="text-gray-400">const skills = await fetch(&quot;https://skillsbd.ru/api/skills&quot;).then(r =&gt; r.json())</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
