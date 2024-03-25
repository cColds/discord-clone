"use client";
import { DmType, UserType } from "@/types/user";
import UserPanel from "../panels/UserPanel";
import PrivateChannels from "../sidebars/PrivateChannels";
import DmChannel from "./DmChannel";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";

type DmPageClientType = {
  recipient: UserType;
  pendingRequests: number;
  dmsOpen: {
    channel: DmType;
    recipient: UserType;
    open: boolean;
    id: string;
  }[];
};

export default function DmPageClient({
  pendingRequests,
  dmsOpen,
  recipient,
}: DmPageClientType) {
  const { user } = useUser();
  if (!user) redirect("/");

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels pendingRequests={pendingRequests} dms={dmsOpen} />
        <UserPanel
          username={user.username}
          displayName={user.displayName}
          email={user.email}
          avatar={user.avatar}
          status={user.status}
        />
      </div>

      <DmChannel user={user} recipient={recipient} />
    </div>
  );
}
