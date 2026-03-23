"use client";

import { useState, useEffect } from "react";
import Markdown from "react-markdown";

export default function SkillContent({ skillId }: { skillId: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/readme?skillId=${skillId}`)
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [skillId]);

  if (loading) return <div className="h-20 animate-pulse rounded-lg bg-gray-900" />;
  if (!content) return null;

  const cleaned = content.replace(/^---[\s\S]*?---\s*/m, "").trim();
  const isLong = cleaned.length > 600;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">SKILL.md</h2>
      <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
        <div
          className={`px-5 py-4 text-sm text-gray-400 leading-relaxed prose-invert ${
            !expanded && isLong ? "max-h-52 overflow-hidden relative" : ""
          }`}
        >
          <Markdown
            components={{
              h1: ({ children }) => <h1 className="text-lg font-bold text-foreground mt-4 mb-2 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold text-foreground mt-3 mb-1">{children}</h3>,
              p: ({ children }) => <p className="mb-2">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
              li: ({ children }) => <li className="text-gray-400">{children}</li>,
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                return isBlock ? (
                  <pre className="rounded bg-gray-950 p-3 my-2 overflow-x-auto text-xs"><code>{children}</code></pre>
                ) : (
                  <code className="text-accent bg-gray-950 px-1 py-0.5 rounded text-xs">{children}</code>
                );
              },
              pre: ({ children }) => <>{children}</>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{children}</a>
              ),
              table: ({ children }) => <table className="text-xs my-2 w-full">{children}</table>,
              th: ({ children }) => <th className="text-left text-gray-500 border-b border-gray-800 pb-1 pr-3">{children}</th>,
              td: ({ children }) => <td className="text-gray-400 border-b border-gray-800/50 py-1 pr-3">{children}</td>,
              strong: ({ children }) => <strong className="text-foreground font-medium">{children}</strong>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-700 pl-3 my-2 text-gray-500">{children}</blockquote>,
            }}
          >
            {expanded ? cleaned : cleaned.slice(0, 600)}
          </Markdown>
          {!expanded && isLong && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent" />
          )}
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full border-t border-gray-800 px-4 py-2 text-xs text-gray-500 hover:text-foreground transition-colors"
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </button>
        )}
      </div>
    </div>
  );
}
