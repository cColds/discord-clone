import { authConfig } from "@/auth.config";
import Register from "@/components/auth/Register";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authConfig);

  if (session) redirect("/");

  return <Register />;
}
