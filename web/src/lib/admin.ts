import { auth } from "./auth";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  return ADMIN_USER_IDS.includes(session.user.id);
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) throw new Error("Forbidden");
  return true;
}
