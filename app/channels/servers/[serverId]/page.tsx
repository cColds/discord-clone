import ServerClient from "@/components/server/client-pages/ServerClient";
import { getServer } from "@/lib/db/getServer";
import { redirect } from "next/navigation";

export default async function ServerPage({
  params,
}: {
  params: { serverId: string };
}) {
  const server = await getServer(params.serverId);
  if (!server) redirect("/");

  return <ServerClient server={server} />;
}
