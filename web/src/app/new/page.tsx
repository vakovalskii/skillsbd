import Header from "@/components/Header";
import { prisma } from "@/lib/db";
import { formatInstalls } from "@/data/skills";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Новые навыки",
  description: "Недавно добавленные навыки для AI-агентов в каталоге skillsbd",
};

export default async function NewSkillsPage() {
  const skills = await prisma.skill.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Новые навыки</h1>
        <p className="text-gray-500 mb-8">Недавно добавленные в каталог</p>

        {skills.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
            <p className="text-gray-500 text-lg">Пока нет новых навыков</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {skills.map((skill) => (
              <Link
                key={skill.id}
                href={`/skill/${skill.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{skill.name}</span>
                    {skill.featured && (
                      <span className="shrink-0 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">
                        рекомендован
                      </span>
                    )}
                    <span className="shrink-0 rounded bg-green-900/30 border border-green-800/50 px-1.5 py-0.5 text-[10px] text-green-400">
                      new
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate">{skill.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span className="font-mono">{skill.owner}/{skill.repo}</span>
                    {skill.authorName && <span>{skill.authorName}</span>}
                    <span>{new Date(skill.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-mono shrink-0 ml-4">
                  {formatInstalls(skill.installs)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
