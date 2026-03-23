import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://skillsbd.ru";

  const skills = await prisma.skill.findMany({
    select: { id: true, updatedAt: true },
  });

  const staticPages = [
    { url: baseUrl, changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/official`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/docs`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/submit`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/changelog`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const skillPages = skills.map((skill) => ({
    url: `${baseUrl}/skill/${skill.id}`,
    lastModified: skill.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...skillPages];
}
