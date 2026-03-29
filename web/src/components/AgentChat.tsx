"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentChat() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userCount >= 20;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!session?.user) return null;

  async function send() {
    if (!input.trim() || isStreaming || limitReached) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Ошибка" }));
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: err.error || "Ошибка" };
          return copy;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const { content, error } = JSON.parse(line.slice(6));
              if (error) {
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: "assistant", content: error };
                  return copy;
                });
              } else if (content) {
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = {
                    role: "assistant",
                    content: copy[copy.length - 1].content + content,
                  };
                  return copy;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "Не удалось подключиться к AI" };
        return copy;
      });
    }

    setIsStreaming(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
          isOpen
            ? "bg-gray-800 hover:bg-gray-700 rotate-45"
            : "bg-accent hover:bg-accent/90 hover:scale-110 animate-live"
        }`}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.04 2 11c0 2.77 1.56 5.22 4 6.76V22l4.16-2.29c.6.1 1.22.16 1.84.16 5.52 0 10-4.04 10-9S17.52 2 12 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[70vh] flex flex-col rounded-xl border border-gray-800 bg-background shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[9px] font-bold text-white">
                AI
              </span>
              <span className="text-sm font-medium">Помощник NeuralDeep</span>
            </div>
            <span className="text-[10px] text-gray-500">{userCount}/20</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-500 mt-8">
                <p className="mb-2">Привет! Я помогу подобрать навыки,</p>
                <p>MCP серверы и инструменты для вашей задачи.</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {["Яндекс аналитика", "1С разработка", "Docker + CI/CD"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="rounded-md border border-gray-800 px-2.5 py-1 text-xs text-gray-400 hover:text-foreground hover:border-gray-600 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-accent/15 text-foreground"
                      : "bg-gray-900 text-gray-300"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    msg.content ? (
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                          a: ({ href, children }) => (
                            <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-gray-950 border border-gray-800 rounded-md p-2 my-1.5 overflow-x-auto text-xs">{children}</pre>
                          ),
                          code: ({ className, children }) => {
                            const isBlock = className?.includes("language-");
                            return isBlock ? (
                              <code className="text-accent text-xs">{children}</code>
                            ) : (
                              <code className="text-accent bg-gray-950 px-1 py-0.5 rounded text-xs">{children}</code>
                            );
                          },
                          ul: ({ children }) => <ul className="list-disc list-inside mb-1.5 space-y-0.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-1.5 space-y-0.5">{children}</ol>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          h1: ({ children }) => <h1 className="text-base font-bold mb-1 text-foreground">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-sm font-bold mb-1 text-foreground">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-foreground">{children}</h3>,
                          strong: ({ children }) => <strong className="text-foreground">{children}</strong>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-gray-700 pl-2 my-1.5 text-gray-400 italic">{children}</blockquote>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-1.5"><table className="text-xs border-collapse">{children}</table></div>
                          ),
                          th: ({ children }) => <th className="border border-gray-800 px-2 py-1 text-left font-medium">{children}</th>,
                          td: ({ children }) => <td className="border border-gray-800 px-2 py-1">{children}</td>,
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    ) : (
                      <div className="flex gap-1">
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-500" />
                      </div>
                    )
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-800">
            {limitReached ? (
              <p className="text-xs text-gray-500 text-center">Лимит сообщений. Обновите страницу.</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Опишите задачу..."
                  disabled={isStreaming}
                  className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
