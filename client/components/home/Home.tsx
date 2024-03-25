import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { getUser } from "@/lib/db/getUser";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function Home() {
  const session = await getServerSession(authConfig);
  const user = await getUser(session?.user.id);
  if (user == null) redirect("/login");

  return <HomeClient />;
}
