import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, owner, repo, description, category, authorName, telegramLink } = body;

  if (!name || !owner || !repo || !description || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const skill = await prisma.skill.create({
    data: {
      name,
      owner,
      repo,
      description,
      category,
      authorName: authorName || null,
      telegramLink: telegramLink || null,
      authorId: session.user.id,
      status: "pending",
    },
  });

  return NextResponse.json({ ...skill, message: "Навык отправлен на модерацию" }, { status: 201 });
}
