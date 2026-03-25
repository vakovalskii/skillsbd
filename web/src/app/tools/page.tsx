import Header from "@/components/Header";
import ToolsGrid from "./ToolsGrid";
import { Suspense } from "react";

export const metadata = {
  title: "CLI инструменты для AI-агентов | NeuralDeep",
  description:
    "Open source CLI: Gemini CLI, Codex, Cline, Goose, OpenCode, openapi-to-cli и другие. 17 инструментов для AI-разработчиков.",
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

export default function ToolsPage() {
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
          <ToolsGrid />
        </Suspense>
      </main>
    </>
  );
}
