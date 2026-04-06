import Header from "@/components/Header";
import ToolsGrid from "./ToolsGrid";
import { Suspense } from "react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CLI инструменты для AI-агентов | NeuralDeep",
  description:
    "Open source CLI: Gemini CLI, Codex, Cline, Goose, OpenCode, openapi-to-cli и другие. Инструменты для AI-разработчиков.",
  openGraph: {
    title: "CLI инструменты — NeuralDeep",
    description: "Open source CLI инструменты для AI-агентов. Gemini CLI, Codex, Cline и другие.",
    url: "https://neuraldeep.ru/tools",
  },
  twitter: {
    card: "summary" as const,
    title: "CLI инструменты — NeuralDeep",
    description: "Open source CLI для AI-агентов",
  },
  keywords: [
    "skills",
    "mcp server",
    "cli tools",
    "ai agents",
    "open source",
  ],
};

export default async function ToolsPage() {
  const dbCli = await prisma.skill.findMany({
    where: { status: "approved", type: "cli" },
    orderBy: { installs: "desc" },
  });

  // Convert DB CLI records to Tool format
  const dbTools = dbCli.map((s) => {
    const tags = s.tags || [];
    const langTag = tags.find((t) => t.startsWith("lang:"));
    const licenseTag = tags.find((t) => t.startsWith("license:"));
    const installTag = tags.find((t) => t.startsWith("install:"));
    const cleanTags = tags.filter((t) => !t.startsWith("lang:") && !t.startsWith("license:") && !t.startsWith("install:"));

    return {
      name: s.name,
      desc: s.description,
      author: s.authorName || s.owner,
      stars: s.githubStars,
      license: licenseTag?.replace("license:", "") || "Open",
      lang: langTag?.replace("lang:", "") || "",
      url: `https://github.com/${s.owner}/${s.repo}`,
      install: installTag?.replace("install:", "") || `npx skillsbd add ${s.owner}/${s.repo}`,
      ru: cleanTags.includes("российские сервисы"),
      category: s.category,
      tags: cleanTags,
    };
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">CLI инструменты</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Три слоя для AI-агентов: навыки дают знания, MCP серверы — доступ к данным,
          CLI инструменты — действия.
        </p>
        <Suspense>
          <ToolsGrid dbTools={dbTools} />
        </Suspense>
      </main>
    </>
  );
}
