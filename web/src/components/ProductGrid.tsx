type Product = {
  name: string;
  domain: string;
  url: string;
  status: "production" | "beta";
  tagline: string;
  description: string;
  stack: string[];
  accent: "blue" | "emerald" | "amber" | "violet" | "cyan";
};

const products: Product[] = [
  {
    name: "hub",
    domain: "hub.neuraldeep.ru",
    url: "https://hub.neuraldeep.ru",
    status: "production",
    tagline: "Свой LLM API на наших GPU",
    description:
      "OpenAI-совместимый gateway. 6 моделей (gpt-oss-120b, qwen3.6, embeddings, whisper) на собственных GPU в РФ. Бесплатный тариф $1/день.",
    stack: ["LiteLLM", "vLLM", "FastAPI", "Traefik"],
    accent: "emerald",
  },
  {
    name: "vamplab",
    domain: "vamplabai.com",
    url: "https://vamplabai.com",
    status: "production",
    tagline: "Telegram search + MCP",
    description:
      "Парсинг и векторный поиск по русскоязычным Telegram-каналам. Qdrant, MCP API для Claude Code и Cursor — для deep research и аналитики.",
    stack: ["Qdrant", "Telethon", "FastAPI", "MCP"],
    accent: "violet",
  },
  {
    name: "own-claw",
    domain: "own-claw.com",
    url: "https://own-claw.com",
    status: "production",
    tagline: "Self-hosted VPS + AI gateway",
    description:
      "Персональный VPS-хостинг с предустановленным AI-шлюзом. KVM-машины, Telegram-auth, Let's Encrypt wildcard, sshpiper, веб-дашборд.",
    stack: ["KVM/libvirt", "FastAPI", "Traefik", "Telegram"],
    accent: "amber",
  },
  {
    name: "speechcore",
    domain: "speechcoreai.com",
    url: "https://speechcoreai.com",
    status: "beta",
    tagline: "Real-time транскрипция",
    description:
      "Whisper на собственной GPU. WebSocket для real-time, batch для архивов, browser extension для записи встреч. SRT/VTT/TXT/JSON экспорт.",
    stack: ["Whisper", "WebSocket", "Vue 3", "MongoDB"],
    accent: "cyan",
  },
  {
    name: "skillsbd",
    domain: "neuraldeep.ru/skills",
    url: "/skills",
    status: "production",
    tagline: "Каталог скилов и MCP",
    description:
      "Open-source агрегатор навыков, MCP-серверов и CLI для российских AI-агентов: Яндекс, Битрикс, 1С, GigaChat, Wildberries.",
    stack: ["Next.js", "Prisma", "PostgreSQL"],
    accent: "blue",
  },
];

const accentClasses: Record<Product["accent"], { ring: string; chip: string; dot: string }> = {
  emerald: {
    ring: "hover:border-emerald-500/40 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.15)]",
    chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  violet: {
    ring: "hover:border-violet-500/40 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.15)]",
    chip: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dot: "bg-violet-400",
  },
  amber: {
    ring: "hover:border-amber-500/40 hover:shadow-[0_0_0_1px_rgba(245,158,11,0.15)]",
    chip: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  cyan: {
    ring: "hover:border-cyan-500/40 hover:shadow-[0_0_0_1px_rgba(6,182,212,0.15)]",
    chip: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  blue: {
    ring: "hover:border-blue-500/40 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.15)]",
    chip: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
};

export default function ProductGrid() {
  return (
    <section id="products" className="border-b border-gray-800 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
              / products
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Что у нас работает</h2>
            <p className="mt-1 text-sm text-gray-400">
              Всё ниже — production, на наших серверах, доступно прямо сейчас.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const a = accentClasses[p.accent];
            const isExternal = p.url.startsWith("http");
            return (
              <a
                key={p.name}
                href={p.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`group relative flex flex-col rounded-lg border border-gray-800 bg-gray-900/50 p-5 transition-all ${a.ring}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${a.dot} ${p.status === "production" ? "animate-pulse" : ""}`} />
                    <span className="font-mono text-base font-semibold text-foreground">
                      {p.name}
                    </span>
                  </div>
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${a.chip}`}
                  >
                    {p.status === "production" ? "live" : "beta"}
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground mb-2">{p.tagline}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-4 flex-1">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-gray-800 bg-gray-950 px-1.5 py-0.5 text-[10px] text-gray-500"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-gray-500 truncate">{p.domain}</span>
                  <span className="text-gray-500 group-hover:text-foreground transition-colors">
                    →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
