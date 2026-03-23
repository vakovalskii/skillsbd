import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_EMAILS = ["kovalskyvr@mail.ru"];
const ADMIN_GITHUB_IDS = ["vakovalskii"];

async function isAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return (
    ADMIN_EMAILS.includes(session.user.email || "") ||
    ADMIN_GITHUB_IDS.includes(session.user.name || "")
  );
}

// GET: list pending skills
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pending = await prisma.skill.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true, image: true } } },
  });

  return NextResponse.json(pending);
}

// POST: approve or reject
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { skillId, action } = await request.json();

  if (!skillId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "skillId and action (approve/reject) required" }, { status: 400 });
  }

  if (action === "reject") {
    await prisma.skill.delete({ where: { id: skillId } });
    return NextResponse.json({ deleted: true });
  }

  const skill = await prisma.skill.update({
    where: { id: skillId },
    data: { status: "approved" },
  });

  return NextResponse.json(skill);
}
