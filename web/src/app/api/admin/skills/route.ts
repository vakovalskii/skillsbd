import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const skills = await prisma.skill.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } }, _count: { select: { comments: true } } },
  });

  return NextResponse.json(skills);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { skillId } = await request.json();
  if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

  await prisma.skill.delete({ where: { id: skillId } });
  return NextResponse.json({ deleted: true });
}
