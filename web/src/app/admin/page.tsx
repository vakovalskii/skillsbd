import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import Header from "@/components/Header";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/");

  const [totalSkills, pendingSkills, totalUsers, totalComments] = await Promise.all([
    prisma.skill.count(),
    prisma.skill.count({ where: { status: "pending" } }),
    prisma.user.count(),
    prisma.comment.count(),
  ]);

  const stats = [
    { label: "Навыков", value: totalSkills, href: "/admin/skills" },
    { label: "На модерации", value: pendingSkills, href: "/admin/moderate", alert: pendingSkills > 0 },
    { label: "Пользователей", value: totalUsers, href: "/admin/users" },
    { label: "Комментариев", value: totalComments },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Админ-панель</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => {
            const inner = (
              <div className={`rounded-lg border p-5 ${s.alert ? "border-yellow-800 bg-yellow-900/10" : "border-gray-800 bg-gray-900"}`}>
                <p className={`text-3xl font-bold ${s.alert ? "text-yellow-400" : ""}`}>{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            );
            return s.href ? (
              <Link key={s.label} href={s.href} className="hover:opacity-80 transition-opacity">
                {inner}
              </Link>
            ) : (
              <div key={s.label}>{inner}</div>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/admin/skills"
            className="rounded-lg border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors"
          >
            <h2 className="font-semibold text-lg mb-2">Управление навыками</h2>
            <p className="text-sm text-gray-500">Просмотр, удаление, изменение статуса навыков</p>
          </Link>
          <Link
            href="/admin/moderate"
            className="rounded-lg border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors"
          >
            <h2 className="font-semibold text-lg mb-2">Модерация</h2>
            <p className="text-sm text-gray-500">Одобрение или отклонение новых навыков</p>
          </Link>
          <Link
            href="/admin/import"
            className="rounded-lg border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors"
          >
            <h2 className="font-semibold text-lg mb-2">Импорт из GitHub</h2>
            <p className="text-sm text-gray-500">Вставьте URL репозитория — парсер найдёт все навыки</p>
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors"
          >
            <h2 className="font-semibold text-lg mb-2">Пользователи</h2>
            <p className="text-sm text-gray-500">Список зарегистрированных пользователей</p>
          </Link>
        </div>
      </main>
    </>
  );
}
