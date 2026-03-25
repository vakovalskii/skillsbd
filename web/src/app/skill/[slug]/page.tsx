import Header from "@/components/Header";
import AuditBadges from "@/components/AuditBadges";
import SkillContent from "@/components/SkillContent";
import Comments from "@/components/Comments";
import InstallBlock from "@/components/InstallBlock";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { formatInstalls } from "@/data/skills";

export const dynamic = "force-dynamic";

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9а-яё\-]/gi, "");
}

async function findSkill(slug: string) {
  const decoded = decodeURIComponent(slug);

  // 1. Exact name match
  let skill = await prisma.skill.findFirst({ where: { name: decoded, status: "approved" } });
  if (skill) return skill;

  // 2. Slug match — find skill whose toSlug(name) equals the slug
  const allSkills = await prisma.skill.findMany({ where: { status: "approved" } });
  skill = allSkills.find((s) => toSlug(s.name) === decoded.toLowerCase()) || null;
  if (skill) return skill;

  // 3. Case-insensitive match — redirect to proper slug
  skill = await prisma.skill.findFirst({
    where: { name: { equals: decoded, mode: "insensitive" }, status: "approved" },
  });
  if (skill) redirect(`/skill/${toSlug(skill.name)}`);

  // 4. Fallback: old cuid URLs
  skill = await prisma.skill.findUnique({ where: { id: slug } });
  if (skill) redirect(`/skill/${toSlug(skill.name)}`);

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = await findSkill(slug);
  if (!skill) return { title: "Навык не найден" };

  const isRu = skill.tags.some((t: string) => ["яндекс", "1с", "1c", "битрикс24", "gigachat", "сбер", "российские сервисы"].includes(t.toLowerCase()));
  const ruLabel = isRu ? " 🇷🇺" : "";
  const title = `${skill.name}${ruLabel} — навык для AI-агентов | NeuralDeep`;
  const description = `${skill.description}. Автор: ${skill.authorName || skill.owner}. ★${skill.githubStars} | ${skill.installs} установок. Установить: npx skillsbd add ${skill.owner}/${skill.repo}/${skill.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description: skill.description,
      url: `https://neuraldeep.ru/skill/${skill.name}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description: skill.description,
    },
  };
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = await findSkill(slug);
  if (!skill) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center flex-wrap gap-3 mb-3">
            <h1 className="text-3xl font-bold">{skill.name}</h1>
            <span className="rounded-md bg-gray-900 border border-gray-800 px-2 py-0.5 text-xs text-gray-400">
              {skill.category}
            </span>
            {skill.featured && (
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                выбор редакции
              </span>
            )}
          </div>
          <p className="text-gray-400 text-lg">{skill.description}</p>
          <p className="text-xs text-gray-600 mt-2">
            Добавлен {new Date(skill.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
            <p className="text-2xl font-bold">{formatInstalls(skill.installs)}</p>
            <p className="text-xs text-gray-500 mt-1">установок</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
            <p className="text-2xl font-bold text-green-400">+{formatInstalls(skill.trending24h)}</p>
            <p className="text-xs text-gray-500 mt-1">за 24 часа</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
            <p className="text-sm font-mono text-accent">{skill.owner}</p>
            <p className="text-xs text-gray-500 mt-1">автор</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
            <p className="text-sm font-mono">{skill.repo}</p>
            <p className="text-xs text-gray-500 mt-1">репозиторий</p>
          </div>
          {skill.githubStars > 0 && (
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 hover-glow">
              <p className="text-2xl font-bold text-yellow-500/80">★ {skill.githubStars}</p>
              <p className="text-xs text-gray-500 mt-1">GitHub звёзд</p>
            </div>
          )}
        </div>

        <SkillContent skillId={skill.id} />

        <InstallBlock
          command={`npx skillsbd add ${skill.owner}/${skill.repo}/${skill.name}`}
          zipUrl={`https://github.com/${skill.owner}/${skill.repo}/archive/refs/heads/main.zip`}
          skillName={skill.name}
          owner={skill.owner}
          repo={skill.repo}
        />

        {skill.authorName && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Автор</h2>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{skill.authorName}</span>
              {skill.telegramLink && (
                <a
                  href={skill.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-gray-800 px-3 py-1 text-sm text-accent hover:border-gray-600 transition-colors"
                >
                  Telegram
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mb-8">
          <AuditBadges skillId={skill.id} />
        </div>

        {skill.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Теги</h2>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-gray-800 bg-gray-900 px-2.5 py-1 text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <Comments skillId={skill.id} />

        <div>
          <h2 className="text-lg font-semibold mb-3">Исходный код</h2>
          <a
            href={`https://github.com/${skill.owner}/${skill.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Открыть на GitHub
          </a>
        </div>
      </main>
    </>
  );
}
