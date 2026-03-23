import Header from "@/components/Header";
import { prisma } from "@/lib/db";
import { formatInstalls } from "@/data/skills";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Выбрано редакцией",
  description: "Лучшие навыки для AI-агентов, отобранные редакцией skillsbd",
};

export default async function EditorsPickPage() {
  const skills = await prisma.skill.findMany({
    where: { featured: true, status: "approved" },
    orderBy: { githubStars: "desc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Выбрано редакцией</h1>
        <p className="text-gray-500 mb-8">
          Навыки, проверенные и рекомендованные командой skillsbd.
        </p>

        {skills.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
            <p className="text-gray-500 text-lg">Скоро здесь появятся рекомендации</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {skills.map((skill) => (
              <a
                key={skill.id}
                href={`/skill/${skill.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9а-яё\-]/gi, '')}`}
                className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{skill.name}</h3>
                    {skill.githubStars > 0 && (
                      <span className="text-xs text-yellow-500/70 font-mono">★{skill.githubStars}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span className="font-mono">{skill.owner}/{skill.repo}</span>
                    <span>{skill.category}</span>
                    {skill.authorName && <span>{skill.authorName}</span>}
                  </div>
                </div>
                <span className="text-sm text-gray-500 font-mono shrink-0">
                  {formatInstalls(skill.installs)} ↓
                </span>
              </a>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
