"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  _count: { skills: number; comments: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <><Header /><main className="mx-auto max-w-5xl px-4 py-12"><p className="text-gray-600">Загрузка...</p></main></>;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Пользователи ({users.length})</h1>

        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3">
              {u.image ? (
                <img src={u.image} alt="" className="h-8 w-8 rounded-full shrink-0" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-800 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.name || "—"}</p>
                <p className="text-xs text-gray-600 truncate">{u.email || "—"}</p>
              </div>
              <span className="text-xs text-gray-600 shrink-0">{u._count.skills} навыков</span>
              <span className="text-xs text-gray-600 shrink-0">{u._count.comments} комм.</span>
              <span className="text-xs text-gray-600 shrink-0">
                {new Date(u.createdAt).toLocaleDateString("ru-RU")}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
