"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

export default function Comments({ skillId }: { skillId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/comments?skillId=${skillId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
  }, [skillId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/skills/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, text }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setText("");
      }
    } catch {}
    setSending(false);
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">
        Комментарии{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {/* Comments list — old first, new at bottom */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-600 mb-4">Пока нет комментариев</p>
      ) : (
        <div className="flex flex-col gap-4 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              {c.user.image ? (
                <img src={c.user.image} alt="" className="h-7 w-7 rounded-full shrink-0 mt-0.5" />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gray-800 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <a href={`/profile/${c.user.name || ""}`} className="text-sm font-medium hover:text-accent transition-colors">{c.user.name || "Аноним"}</a>
                  <span className="text-xs text-gray-600">
                    {new Date(c.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5 whitespace-pre-wrap break-words">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment form — at the bottom */}
      {session ? (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            {session.user?.image && (
              <img src={session.user.image} alt="" className="h-8 w-8 rounded-full shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Написать комментарий..."
                maxLength={1000}
                rows={2}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">{text.length}/1000</span>
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {sending ? "..." : "Отправить"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-center text-sm text-gray-500">
          <a href="/api/auth/signin" className="text-accent hover:underline">Войдите через GitHub</a> чтобы оставить комментарий
        </div>
      )}
    </div>
  );
}
