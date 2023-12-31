"use client";

import { Unblock } from "@/components/svgs";
import ActionButton from "@/components/tooltip/ActionButton";
import { unblockUser } from "@/lib/db/social/blocked/unblockUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const BlockedActions = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <ActionButton
      name="Unblock"
      onClick={async (e) => {
        e.stopPropagation();

        await unblockUser(session?.user.id ?? "", id);
        router.refresh();
      }}
      className="hover:text-info-danger-foreground"
    >
      <Unblock />
    </ActionButton>
  );
};

export default BlockedActions;
