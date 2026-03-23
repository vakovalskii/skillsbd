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
}

export async function getSkills(sort: "all" | "trending" = "all"): Promise<Skill[]> {
  const orderBy =
    sort === "trending"
      ? { trending24h: "desc" as const }
      : { installs: "desc" as const };

  return prisma.skill.findMany({ orderBy, take: 100 });
}

export async function getTotalInstalls(): Promise<number> {
  const result = await prisma.skill.aggregate({ _sum: { installs: true } });
  return result._sum.installs ?? 0;
}

export async function getTotalTrending(): Promise<number> {
  const result = await prisma.skill.aggregate({ _sum: { trending24h: true } });
  return result._sum.trending24h ?? 0;
}

export function formatInstalls(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}
