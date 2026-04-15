import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET: list my skills
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(skills);
}

// PATCH: update my skill
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const {
    skillId,
    name,
    description,
    category,
    tags,
    authorName,
    telegramLink,
    owner,
    repo,
    type,
  } = await request.json();

  if (!skillId) {
    return NextResponse.json({ error: "skillId required" }, { status: 400 });
  }

  // Verify ownership
  const skill = await prisma.skill.findFirst({
    where: { id: skillId, authorId: session.user.id },
  });

  if (!skill) {
    return NextResponse.json({ error: "skill not found or not yours" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name.trim();
  if (description !== undefined) data.description = description.trim();
  if (category !== undefined) data.category = category.trim();
  if (tags !== undefined) data.tags = Array.isArray(tags) ? tags : [];
  if (authorName !== undefined) data.authorName = authorName.trim() || null;
  if (telegramLink !== undefined) data.telegramLink = telegramLink.trim() || null;
  if (owner !== undefined) data.owner = owner.trim();
  if (repo !== undefined) data.repo = repo.trim();
  if (type !== undefined && ["skill", "mcp", "cli"].includes(type)) data.type = type;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const updated = await prisma.skill.update({
    where: { id: skillId },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE: delete my skill
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { skillId } = await request.json();

  if (!skillId) {
    return NextResponse.json({ error: "skillId required" }, { status: 400 });
  }

  // Verify ownership
  const skill = await prisma.skill.findFirst({
    where: { id: skillId, authorId: session.user.id },
  });

  if (!skill) {
    return NextResponse.json({ error: "skill not found or not yours" }, { status: 404 });
  }

  await prisma.skill.delete({ where: { id: skillId } });

  return NextResponse.json({ deleted: true, id: skillId });
}
