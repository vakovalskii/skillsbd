import Header from "@/components/Header";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatInstalls, toSlug } from "@/data/skills";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findFirst({ where: { name: username } });
  if (!user) return { title: "Пользователь не найден" };
  return {
    title: `${user.name} — профиль на skillsbd`,
    description: `Навыки и активность ${user.name} в каталоге skillsbd`,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decoded = decodeURIComponent(username);

  const user = await prisma.user.findFirst({
    where: { name: decoded },
    include: {
      skills: {
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { skill: { select: { name: true } } },
      },
    },
  });

  if (!user) notFound();

  const totalInstalls = user.skills.reduce((sum, s) => sum + s.installs, 0);
  const totalStars = user.skills.reduce((sum, s) => sum + s.githubStars, 0);
  const memberSince = new Date(user.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {user.image && (
            <img src={user.image} alt="" className="h-16 w-16 rounded-full" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-500">На skillsbd с {memberSince}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <p className="text-2xl font-bold">{user.skills.length}</p>
            <p className="text-xs text-gray-500 mt-1">навыков</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <p className="text-2xl font-bold">{formatInstalls(totalInstalls)}</p>
            <p className="text-xs text-gray-500 mt-1">установок</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <p className="text-2xl font-bold text-yellow-500/80">★ {formatInstalls(totalStars)}</p>
            <p className="text-xs text-gray-500 mt-1">GitHub звёзд</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <p className="text-2xl font-bold">{user.comments.length}</p>
            <p className="text-xs text-gray-500 mt-1">комментариев</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Опубликованные навыки{user.skills.length > 0 && ` (${user.skills.length})`}
          </h2>
          {user.skills.length === 0 ? (
            <p className="text-sm text-gray-600">Пока нет опубликованных навыков</p>
          ) : (
            <div className="flex flex-col gap-3">
              {user.skills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/skill/${toSlug(skill.name)}`}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.name}</span>
                      {skill.featured && (
                        <span className="shrink-0 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">
                          выбор редакции
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{skill.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {skill.githubStars > 0 && (
                      <span className="text-xs text-yellow-500/70 font-mono">★{skill.githubStars}</span>
                    )}
                    <span className="text-sm text-gray-500 font-mono">{formatInstalls(skill.installs)} ↓</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent comments */}
        {user.comments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Последние комментарии</h2>
            <div className="flex flex-col gap-3">
              {user.comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-gray-800 bg-gray-900 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/skill/${toSlug(c.skill.name)}`}
                      className="text-xs text-accent hover:underline"
                    >
                      {c.skill.name}
                    </Link>
                    <span className="text-xs text-gray-600">
                      {new Date(c.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
