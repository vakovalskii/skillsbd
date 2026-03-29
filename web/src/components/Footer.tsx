import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8 px-4">
      <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
        <div>
          <h4 className="font-medium text-foreground mb-3">Каталог</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/official" className="hover:text-foreground transition-colors">Выбор редакции</Link></li>
            <li><Link href="/submit" className="hover:text-foreground transition-colors">Добавить навык</Link></li>
            <li><Link href="/tools" className="hover:text-foreground transition-colors">CLI инструменты</Link></li>
            <li><Link href="/docs" className="hover:text-foreground transition-colors">Документация</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3">О проекте</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/about" className="hover:text-foreground transition-colors">О NeuralDeep</Link></li>
            <li><Link href="/blog" className="hover:text-foreground transition-colors">Блог</Link></li>
            <li><Link href="/changelog" className="hover:text-foreground transition-colors">Обновления</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3">Навыки по агентам</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/claude-code-skills" className="hover:text-foreground transition-colors">Claude Code Skills</Link></li>
            <li><Link href="/cursor-ai-skills" className="hover:text-foreground transition-colors">Cursor AI Skills</Link></li>
            <li><Link href="/ai-agents" className="hover:text-foreground transition-colors">AI агенты</Link></li>
            <li><Link href="/claude-code-russia" className="hover:text-foreground transition-colors">Claude Code в России</Link></li>
            <li><Link href="/russian-agents" className="hover:text-foreground transition-colors">Российские агенты</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3">Сообщество</h4>
          <ul className="space-y-2 text-gray-500">
            <li><a href="https://github.com/vakovalskii/neuraldeep" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
            <li><a href="https://t.me/neuraldeep" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Telegram</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3">Правовая информация</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Конфиденциальность</Link></li>
            <li><Link href="/terms" className="hover:text-foreground transition-colors">Условия использования</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
        NeuralDeep — агрегатор навыков и инструментов для AI-агентов
      </div>
    </footer>
  );
}
