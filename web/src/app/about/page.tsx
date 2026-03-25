import Header from "@/components/Header";

export const metadata = {
  title: "О проекте",
  description: "NeuralDeep — российский агрегатор навыков, MCP серверов и AI-инструментов. История создания и миссия.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">О NeuralDeep</h1>
        <p className="text-sm text-gray-600 mb-8">Российский агрегатор навыков, MCP серверов и AI-инструментов</p>

        <div className="flex flex-col gap-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Зачем это нужно?</h2>
            <p>
              В нашем AI-чатике друзей ребята спросили: а почему нет аналога{" "}
              <a href="https://skills.sh" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">skills.sh</a>{" "}
              в РФ? Где будут собраны скиллы вокруг наших российских сервисов для любых
              агентов в знакомом формате установки для кодинг-агентов?
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Что такое NeuralDeep?</h2>
            <p>
              <strong className="text-foreground">NeuralDeep</strong> — это открытый каталог навыков
              для AI-агентов с фокусом на российские сервисы. Навыки для работы с Яндекс, Битрикс, 1С
              и другими сервисами, которые нужны каждый день. Устанавливайте одной командой, делитесь
              с RU-комьюнити.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Чем отличается?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-foreground">Фокус на РФ</strong> — навыки для Яндекс (Wordstat, Вебмастер, Метрика),
                Битрикс24, 1С:Предприятие, Wildberries, и других сервисов, востребованных в России
              </li>
              <li>
                <strong className="text-foreground">Комьюнити</strong> — с{" "}
                <a href="https://t.me/neuraldeep" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">нашего канала</a>{" "}
                стартует сообщество вокруг каталога. Я сам лично поддерживаю ряд навыков и добавляю
                навыки от блогеров, кто работает с этими сервисами каждый день
              </li>
              <li>
                <strong className="text-foreground">Проверки безопасности</strong> — каждый навык проходит аудит:
                репозиторий, лицензия, активность, автор, сканирование на опасные паттерны. Будем развивать сканеры
              </li>
              <li>
                <strong className="text-foreground">Модерация</strong> — новые навыки проходят ручную модерацию.
                Будем автоматизировать
              </li>
              <li>
                <strong className="text-foreground">Навык find-skills</strong> — упаковывает всю базу данных
                в мощный поисковик для агентов
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Как использовать?</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm space-y-2 mb-4">
              <p><span className="text-gray-500"># </span>Поиск навыков</p>
              <p><span className="text-gray-500">$ </span>npx skillsbd search яндекс</p>
              <p className="mt-2"><span className="text-gray-500"># </span>Установка</p>
              <p><span className="text-gray-500">$ </span>npx skillsbd add owner/repo/skill-name</p>
            </div>
            <p>
              Любой может зарегистрироваться через GitHub и тут же залить свой навык.
              Поддерживается формат claude-skill и любые репозитории со SKILL.md.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Топ навыки на старте</h2>
            <div className="grid gap-3">
              <a href="/skill/1c-enterprise-skills" className="rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors">
                <h3 className="font-medium text-foreground">1С:Предприятие 8.3</h3>
                <p className="text-sm text-gray-500 mt-1">65 навыков для полного цикла разработки — конфигурации, формы, роли, тестирование</p>
              </a>
              <a href="/skill/bitrix24" className="rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors">
                <h3 className="font-medium text-foreground">Битрикс24</h3>
                <p className="text-sm text-gray-500 mt-1">CRM, задачи, календарь, чаты, диск — всё через REST API</p>
              </a>
              <a href="/skill/yandex-wordstat" className="rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors">
                <h3 className="font-medium text-foreground">Яндекс сервисы</h3>
                <p className="text-sm text-gray-500 mt-1">Wordstat, Вебмастер, Метрика, Поиск — аналитика и SEO</p>
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Кто за этим стоит?</h2>
            <p>
              Привет! Я <strong className="text-foreground">Валерий Ковальский</strong>.
              Проект навайбкожен частично из-за задержки рейса Сочи→СПБ на 6 часов.
              Поддерживаю каталог лично, добавляю навыки, развиваю платформу.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://t.me/neuraldeep"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
              >
                Telegram
              </a>
              <a
                href="https://github.com/vakovalskii/skillsbd-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </section>

          <div className="rounded-lg border border-accent/20 bg-accent/5 p-6 text-center">
            <p className="text-foreground font-medium mb-2">Stay Tuned!</p>
            <p className="text-sm">
              Подписывайтесь на{" "}
              <a href="https://t.me/neuraldeep" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @neuraldeep
              </a>{" "}
              — там все обновления, новые навыки и развитие проекта
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
