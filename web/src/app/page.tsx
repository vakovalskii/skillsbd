import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Leaderboard from "@/components/Leaderboard";
import { getSkills, getTotalInstalls, getTotalTrending } from "@/data/skills";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [skills, totalInstalls, totalTrending] = await Promise.all([
    getSkills(),
    getTotalInstalls(),
    getTotalTrending(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(300px,400px)_1fr] lg:gap-12 py-4">
          <aside className="lg:sticky lg:top-14 lg:self-start">
            <Hero />
          </aside>
          <section>
            <Leaderboard
              initialSkills={skills}
              totalInstalls={totalInstalls}
              totalTrending={totalTrending}
            />
          </section>
        </div>
      </main>
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-3">Каталог</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="/official" className="hover:text-foreground transition-colors">Выбор редакции</a></li>
              <li><a href="/submit" className="hover:text-foreground transition-colors">Добавить навык</a></li>
              <li><a href="/tools" className="hover:text-foreground transition-colors">CLI инструменты</a></li>
              <li><a href="/docs" className="hover:text-foreground transition-colors">Документация</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">О проекте</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="/about" className="hover:text-foreground transition-colors">О skillsbd</a></li>
              <li><a href="/blog" className="hover:text-foreground transition-colors">Блог</a></li>
              <li><a href="/changelog" className="hover:text-foreground transition-colors">Обновления</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Навыки по агентам</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="/claude-code-skills" className="hover:text-foreground transition-colors">Claude Code Skills</a></li>
              <li><a href="/cursor-ai-skills" className="hover:text-foreground transition-colors">Cursor AI Skills</a></li>
              <li><a href="/ai-agents" className="hover:text-foreground transition-colors">AI агенты</a></li>
              <li><a href="/claude-code-russia" className="hover:text-foreground transition-colors">Claude Code в России</a></li>
              <li><a href="/russian-agents" className="hover:text-foreground transition-colors">Российские агенты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Сообщество</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="https://github.com/vakovalskii/skillsbd" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
              <li><a href="https://t.me/neuraldeep" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Telegram</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Правовая информация</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="/privacy" className="hover:text-foreground transition-colors">Конфиденциальность</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">Условия использования</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
          skillsbd — открытый каталог навыков для AI-агентов
        </div>
      </footer>
    </>
  );
}
