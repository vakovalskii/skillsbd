import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ghHeaders: Record<string, string> = {
  "User-Agent": "skillsbd-cron",
  Accept: "application/vnd.github+json",
};

if (process.env.GITHUB_TOKEN) {
  ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "skillsbd-cron-2026";

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({
    select: { id: true, name: true, owner: true, repo: true },
  });
  const results = [];

  for (const skill of skills) {
    try {
      // Run audit
      const auditRes = await fetch(`${process.env.NEXTAUTH_URL || "https://skillsbd.ru"}/api/skills/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: skill.id }),
      });
      const auditData = await auditRes.json();

      // Sync GitHub stars
      let stars = 0;
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${skill.owner}/${skill.repo}`, { headers: ghHeaders });
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          stars = ghData.stargazers_count || 0;
        }
      } catch {}

      await prisma.skill.update({
        where: { id: skill.id },
        data: { githubStars: stars },
      });

      results.push({
        skill: skill.name,
        ok: true,
        checks: Array.isArray(auditData) ? auditData.length : 0,
        stars,
      });
    } catch (e) {
      results.push({ skill: skill.name, ok: false });
    }
  }

  return NextResponse.json({ audited: results.length, results });
}
