import { auth } from "./auth";

const ADMIN_USER_ID = "cmn2pemwd0000rv01qkeco1nb";

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.id === ADMIN_USER_ID;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) throw new Error("Forbidden");
  return true;
}
