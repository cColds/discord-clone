"use client";

import { useSocket } from "@/app/providers/SocketProvider";
import { Unblock } from "@/components/svgs";
import ActionButton from "@/components/tooltip/ActionButton";
import { unblockUser } from "@/lib/actions/social/unblockUser";
import { useSession } from "next-auth/react";

const BlockedActions = ({ recipientId }: { recipientId: string }) => {
  const { data: session } = useSession();

  const { socket } = useSocket();

  return (
    <ActionButton
      name="Unblock"
      onClick={async (e) => {
        e.stopPropagation();

        try {
          const senderId = session?.user.id;

          if (!senderId) throw new Error("Your user id is invalid");

          await unblockUser(senderId, recipientId);

          socket.emit("unblock-user", { senderId, recipientId });
        } catch (err) {
          console.error(err);
        }
      }}
      className="hover:text-info-danger-foreground"
    >
      <Unblock />
    </ActionButton>
  );
};

export default BlockedActions;
