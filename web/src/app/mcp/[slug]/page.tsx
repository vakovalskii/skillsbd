import Header from "@/components/Header";
import Comments from "@/components/Comments";
import { mcpServers, type McpServer } from "@/data/mcp-servers";
import { prisma } from "@/lib/db";
import { toSlug } from "@/data/skills";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface McpServerWithId extends McpServer {
  dbId?: string;
}

async function findMcpServer(slug: string): Promise<McpServerWithId | null> {
  // 1. Static servers
  const staticServer = mcpServers.find((s) => s.slug === slug);
  if (staticServer) return staticServer;

  // 2. DB servers (type=mcp)
  const allMcp = await prisma.skill.findMany({
    where: { status: "approved", type: "mcp" },
  });
  const dbItem = allMcp.find((s) => toSlug(s.name) === slug);
  if (dbItem) {
    return {
      name: dbItem.name,
      slug: toSlug(dbItem.name),
      desc: dbItem.description,
      author: dbItem.authorName || dbItem.owner,
      stars: dbItem.githubStars,
      license: "Open",
      url: `https://github.com/${dbItem.owner}/${dbItem.repo}`,
      install: `npx skillsbd add ${dbItem.owner}/${dbItem.repo}/${dbItem.name}`,
      category: dbItem.category,
      tags: dbItem.tags,
      dbId: dbItem.id,
    };
  }

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = await findMcpServer(slug);
  if (!server) return { title: "MCP сервер не найден" };

  const isRu = server.category === "Российские";
  const ruLabel = isRu ? " 🇷🇺" : "";
  const title = `${server.name}${ruLabel} — MCP сервер для AI-агентов | NeuralDeep`;
  const description = `${server.desc}. Автор: ${server.author}. ${server.stars > 0 ? `★${server.stars}` : ""} Подключение: ${server.install}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description: server.desc,
      url: `https://neuraldeep.ru/mcp/${server.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description: server.desc,
    },
  };
}

export default async function McpServerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = await findMcpServer(slug);
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

        <div className="flex gap-3 mb-10">
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

        {server.dbId && <Comments skillId={server.dbId} />}
      </main>
    </>
  );
}
