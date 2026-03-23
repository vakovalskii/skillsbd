import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const headers: Record<string, string> = {
  "User-Agent": "skillsbd",
  Accept: "application/vnd.github+json",
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

// Пути где может лежать SKILL.md или README.md (fallback)
function getPaths(name: string): string[] {
  return [
    `plugins/${name}/skills/${name}/SKILL.md`,
    `plugins/${name}/SKILL.md`,
    `skills/${name}/SKILL.md`,
    `${name}/SKILL.md`,
    "SKILL.md",
    "README.md",
  ];
}

export async function GET(request: NextRequest) {
  const skillId = request.nextUrl.searchParams.get("skillId");
  if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) return NextResponse.json({ error: "not found" }, { status: 404 });

  const paths = getPaths(skill.name);

  for (const path of paths) {
    try {
      const url = `https://api.github.com/repos/${skill.owner}/${skill.repo}/contents/${path}`;
      const res = await fetch(url, { headers });
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.download_url) continue;

      const contentRes = await fetch(data.download_url);
      if (!contentRes.ok) continue;

      const content = await contentRes.text();
      return NextResponse.json({ content, path });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ content: null, path: null });
}
