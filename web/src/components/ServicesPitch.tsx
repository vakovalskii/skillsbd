type Service = {
  title: string;
  description: string;
  icon: string;
};

const services: Service[] = [
  {
    title: "LLM gateway на ваших GPU",
    description:
      "Self-hosted OpenAI-совместимый API, multi-tenant, с биллингом по юзерам и observability. Развернём за 1-2 недели.",
    icon: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  },
  {
    title: "Корпоративный RAG / поиск",
    description:
      "Embeddings + reranker + Qdrant/PG-vector. Подключаем к Confluence, Bitrix, файловым шарам. Без утечек в облако.",
    icon: "M11 4a7 7 0 110 14 7 7 0 010-14zm0 2a5 5 0 100 10 5 5 0 000-10zm5.707 11.293l4 4a1 1 0 01-1.414 1.414l-4-4 1.414-1.414z",
  },
  {
    title: "Кастомный AI-агент",
    description:
      "Под ваш стек — CRM, базу знаний, документооборот. На фундаменте проверенных open-source кирпичей (Claude Code, Cursor, MCP).",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    title: "Audio / транскрипция on-prem",
    description:
      "Whisper на ваших GPU, real-time WebSocket, batch для архивов. Расшифровка совещаний, поддержки, подкастов.",
    icon: "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm-7 11a7 7 0 0014 0M12 19v4M8 23h8",
  },
];

export default function ServicesPitch() {
  return (
    <section id="services" className="border-b border-gray-800 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
            / services
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl mb-3">
            И сделаем <span className="text-accent">под вас</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed sm:text-base">
            Те же технологии, что крутятся в наших продуктах — но развернуты в вашем
            контуре, с вашими данными, под ваши процессы. От прототипа до production.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-lg border border-gray-800 bg-gray-900/30 p-5 transition-colors hover:border-gray-700"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 border border-accent/20">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-accent" aria-hidden>
                    <path
                      d={s.icon}
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-foreground pt-1">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-5 py-4">
          <span className="text-sm text-foreground">
            Нужно что-то из этого или своё?
          </span>
          <a
            href="https://t.me/VaKovaLskii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Написать в Telegram
            <span className="font-mono opacity-80">@VaKovaLskii →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
