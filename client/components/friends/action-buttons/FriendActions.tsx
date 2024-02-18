"use client";

import { useRouter } from "next/navigation";
import { Message, More } from "@/components/svgs";
import ActionButton from "@/components/tooltip/ActionButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unfriendUser } from "@/lib/db/social/friends/unfriendUser";
import { useSession } from "next-auth/react";
import { useSocket } from "@/app/providers/SocketProvider";

const FriendActions = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { socket } = useSocket();

  return (
    <>
      <ActionButton
        name="Message"
        onClick={() => router.push(`/channels/${id}`)}
      >
        <Message />
      </ActionButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ActionButton name="More" onClick={(e) => e.stopPropagation()}>
            <More />
          </ActionButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            Start Video Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            Start Voice Call
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={async (e) => {
              e.stopPropagation();

              const senderId = session?.user.id;
              const recipientId = id;

              if (!senderId) throw new Error("Your user id is invalid");

              await unfriendUser(session?.user.id ?? "", recipientId);

              socket.emit("unfriend-user", { senderId, recipientId });
            }}
          >
            Remove Friend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FriendActions;
