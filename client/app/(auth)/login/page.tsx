import { authConfig } from "@/auth.config";
import Login from "@/components/auth/Login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authConfig);

  if (session) redirect("/");

  return <Login />;
}
