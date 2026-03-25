import Header from "@/components/Header";
import { mcpServers } from "@/data/mcp-servers";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return mcpServers.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = mcpServers.find((s) => s.slug === slug);
  if (!server) return { title: "MCP сервер не найден" };

  return {
    title: `${server.name} — MCP сервер для AI-агентов`,
    description: `${server.desc}. Автор: ${server.author}. Установка: ${server.install}`,
    openGraph: {
      title: `${server.name} — MCP сервер`,
      description: server.desc,
      url: `https://neuraldeep.ru/mcp/${server.slug}`,
    },
  };
}

export default async function McpServerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = mcpServers.find((s) => s.slug === slug);
  if (!server) notFound();

  const isRu = server.category === "Российские";

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h1 className="text-3xl font-bold">{server.name}</h1>
            <span className="rounded-md bg-gray-900 border border-gray-800 px-2 py-0.5 text-xs text-gray-400">
              {server.category}
            </span>
            {isRu && (
              <span className="rounded bg-red-900/30 border border-red-800/40 px-2 py-0.5 text-[10px] font-bold text-red-400">
                RU
              </span>
            )}
          </div>
          <p className="text-gray-400 text-lg">{server.desc}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
            <p className="text-sm font-medium">{server.author}</p>
            <p className="text-xs text-gray-500 mt-1">автор</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
            <p className="text-sm font-mono">{server.license}</p>
            <p className="text-xs text-gray-500 mt-1">лицензия</p>
          </div>
          {server.stars > 0 && (
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
              <p className="text-2xl font-bold text-yellow-500/80">★ {server.stars}</p>
              <p className="text-xs text-gray-500 mt-1">GitHub звёзд</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Подключение</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 font-mono text-sm overflow-x-auto whitespace-nowrap">
            {server.install}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Теги</h2>
          <div className="flex flex-wrap gap-2">
            {server.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-gray-800 bg-gray-900 px-2.5 py-1 text-xs text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={server.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
          >
            Подробнее →
          </a>
          <Link
            href="/mcp"
            className="inline-flex items-center gap-2 rounded-md border border-gray-800 px-4 py-2 text-sm text-gray-400 hover:border-gray-600 hover:text-foreground transition-colors"
          >
            ← Все MCP серверы
          </Link>
        </div>
      </main>
    </>
  );
}
