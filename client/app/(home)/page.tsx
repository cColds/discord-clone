import { authConfig } from "@/auth.config";
import HomeClient from "@/components/home/HomeClient";
import { getUser } from "@/lib/db/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authConfig);
  const user = await getUser(session?.user.id);
  if (user == null) redirect("/login");

  return <HomeClient />;
}
