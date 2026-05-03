import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "all";
  const q = searchParams.get("q") || "";

  const type = searchParams.get("type") || "skill";

  if (q) {
    // Smart search: trigram similarity + tags array + description FTS
    // PostgreSQL doesn't allow SELECT aliases in ORDER BY expressions —
    // use subquery so we can ORDER BY the computed score.
    const results = await prisma.$queryRawUnsafe(
      `
      SELECT * FROM (
        SELECT s.*,
          GREATEST(
            similarity(s.name, $1),
            similarity(s.description, $1),
            similarity(s.owner, $1),
            similarity(COALESCE(s."authorName", ''), $1)
          ) +
          (s.name ILIKE '%' || $1 || '%')::int * 0.5 +
          (s.description ILIKE '%' || $1 || '%')::int * 0.3 +
          (s.owner ILIKE '%' || $1 || '%')::int * 0.2 +
          (EXISTS (SELECT 1 FROM unnest(s.tags) t WHERE t ILIKE '%' || $1 || '%'))::int * 0.4
          AS score
        FROM "Skill" s
        WHERE s.status = 'approved'
          AND s.type = $2
          AND (
            s.name ILIKE '%' || $1 || '%'
            OR s.description ILIKE '%' || $1 || '%'
            OR s.owner ILIKE '%' || $1 || '%'
            OR s."authorName" ILIKE '%' || $1 || '%'
            OR EXISTS (SELECT 1 FROM unnest(s.tags) t WHERE t ILIKE '%' || $1 || '%')
            OR similarity(s.name, $1) > 0.15
            OR similarity(s.description, $1) > 0.15
          )
      ) ranked
      ORDER BY score DESC, installs DESC
      LIMIT 100
      `,
      q,
      type
    );

    return NextResponse.json(results);
  }

  // No search query — standard listing
  const baseWhere = { status: "approved" as const, type };

  const orderBy =
    sort === "trending"
      ? { trending24h: "desc" as const }
      : sort === "stars"
      ? { githubStars: "desc" as const }
      : sort === "new"
      ? { createdAt: "desc" as const }
      : { installs: "desc" as const };

  const skills = await prisma.skill.findMany({ where: baseWhere, orderBy, take: 100 });
  return NextResponse.json(skills);
}
