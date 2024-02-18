"use client";

import { Unblock } from "@/components/svgs";
import ActionButton from "@/components/tooltip/ActionButton";
import { unblockUser } from "@/lib/db/social/blocked/unblockUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const BlockedActions = ({ recipientId }: { recipientId: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <ActionButton
      name="Unblock"
      onClick={async (e) => {
        e.stopPropagation();

        try {
          const senderId = session?.user.id;

          if (!senderId) throw new Error("Your user id is invalid");

          await unblockUser(senderId, recipientId);
          router.refresh();
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
