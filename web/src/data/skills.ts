import { prisma } from "@/lib/db";

export interface Skill {
  id: string;
  name: string;
  owner: string;
  repo: string;
  description: string;
  installs: number;
  trending24h: number;
  category: string;
  tags: string[];
  authorName: string | null;
  telegramLink: string | null;
  featured: boolean;
  githubStars: number;
  createdAt: Date | string;
  _count?: { comments: number };
}

export async function getSkills(sort: "all" | "trending" = "all"): Promise<Skill[]> {
  const orderBy =
    sort === "trending"
      ? { trending24h: "desc" as const }
      : { installs: "desc" as const };

  return prisma.skill.findMany({
    where: { status: "approved", type: "skill" },
    orderBy,
    take: 100,
    include: { _count: { select: { comments: true } } },
  });
}

export async function getTotalInstalls(): Promise<number> {
  const result = await prisma.skill.aggregate({ where: { status: "approved", type: "skill" }, _sum: { installs: true } });
  return result._sum.installs ?? 0;
}

export async function getTotalTrending(): Promise<number> {
  const result = await prisma.skill.aggregate({ where: { status: "approved", type: "skill" }, _sum: { trending24h: true } });
  return result._sum.trending24h ?? 0;
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9а-яё\-]/gi, "");
}

export function formatInstalls(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}
