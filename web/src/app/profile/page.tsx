import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProfileRedirect() {
  const session = await auth();
  if (!session?.user?.name) redirect("/");
  redirect(`/profile/${session.user.name}`);
}
