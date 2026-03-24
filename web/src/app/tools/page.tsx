import Header from "@/components/Header";
import ToolsGrid from "./ToolsGrid";

export const metadata = {
  title: "CLI инструменты для AI-агентов",
  description:
    "Инструменты для работы с AI-агентами: openapi-to-cli, skillsbd CLI, create-skillsbd, MCP серверы и другие.",
  keywords: [
    "cli tools",
    "openapi-to-cli",
    "skillsbd",
    "ai agents tools",
    "cli для агентов",
    "mcp server",
  ],
};

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">CLI инструменты</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Инструменты, которые делают AI-агентов полезнее.
          Навыки дают знания, инструменты дают действия.
        </p>
        <ToolsGrid />
      </main>
    </>
  );
}
