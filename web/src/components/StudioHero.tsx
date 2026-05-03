import Link from "next/link";

export default function StudioHero() {
  return (
    <section className="relative overflow-hidden border-b border-gray-800">
      {/* мягкая радиальная подсветка через accent — visual anchor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(ellipse 40% 40% at 85% 70%, rgba(16,185,129,0.12), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            AI-инженерия · on-prem · РФ
          </span>
          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
            5 продуктов в проде
          </span>
          <a
            href="https://github.com/vakovalskii"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-gray-800 bg-gray-900 px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            1100+⭐ open source
          </a>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-5 leading-tight">
          AI-инфраструктура{" "}
          <span className="text-accent">on-prem</span>
          <br className="hidden sm:inline" /> в России
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg lg:text-xl mb-8">
          Свои GPU, свои продукты, свой open source. Делаем кастомные LLM-системы,
          корпоративный поиск, RAG, аудио — полностью на ваших серверах.{" "}
          <span className="text-foreground">И сделаем под вас.</span>
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://hub.neuraldeep.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Готовый LLM API
            <span className="font-mono text-sm opacity-80">hub.neuraldeep.ru →</span>
          </a>
          <a
            href="https://t.me/VaKovaLskii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900 px-5 py-3 font-medium text-foreground hover:border-gray-600 hover:bg-gray-800 transition-colors"
          >
            Обсудить проект
            <span className="font-mono text-sm text-gray-400">@VaKovaLskii →</span>
          </a>
        </div>

        {/* Trust signals row */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-500 font-mono">
          <span>● 6× GPU-серверов в офисе РФ</span>
          <span>● RU-first стек</span>
          <span>● OpenAI-совместимое API</span>
          <span>● Production-ready</span>
        </div>
      </div>
    </section>
  );
}
