"use client";

import { ServerType } from "@/types/server";
import ServerSidebar from "../ServerSidebar";
import { redirect } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import NoTextChannels from "../NoTextChannels";

type ServerClientProps = {
  server: ServerType;
};

const ServerClient = ({ server }: ServerClientProps) => {
  const { user } = useUser();
  if (!user) redirect("/");

  return (
    <div className="flex grow overflow-hidden h-full">
      <ServerSidebar server={server} user={user} />

      <NoTextChannels />
    </div>
  );
};

export default ServerClient;
