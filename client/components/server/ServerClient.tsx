"use client";

import { ServerType } from "@/types/server";
import ServerSidebar from "./ServerSidebar";
import { redirect } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";

const ServerClient = ({ server }: { server: ServerType }) => {
  const { user } = useUser();
  if (!user) redirect("/");

  return (
    <div className="flex grow overflow-hidden h-full">
      <ServerSidebar server={server} user={user} />
    </div>
  );
};

export default ServerClient;
