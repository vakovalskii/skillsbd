import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const skillId = request.nextUrl.searchParams.get("skillId");
  if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { skillId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, image: true } } },
    take: 50,
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId, text } = await request.json();

  if (!skillId || !text || text.trim().length === 0) {
    return NextResponse.json({ error: "skillId and text required" }, { status: 400 });
  }

  if (text.length > 1000) {
    return NextResponse.json({ error: "Max 1000 characters" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      skillId,
      userId: session.user.id,
      text: text.trim(),
    },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
