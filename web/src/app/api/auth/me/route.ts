import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ user: null, isAdmin: false });

  return NextResponse.json({
    user: session.user,
    isAdmin: await isAdmin(),
  });
}
