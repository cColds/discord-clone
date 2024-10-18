import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeaveServerModal from "../modals/server/LeaveServerModal";
import { useState } from "react";
import { ServerType } from "@/types/server";
import { UserType } from "@/types/user";
import { CreateInvite } from "../svgs";
import CreateInviteModal from "../modals/server/CreateInviteModal";
import { createInvite } from "@/lib/db/createInvite";

type ServerDropdownProps = {
  children: React.ReactNode;
  server: ServerType;
  user: UserType;
};

const ServerDropdown = ({ children, server, user }: ServerDropdownProps) => {
  const [invite, setInvite] = useState("");
  const [leaveServerModalOpen, setLeaveServerModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleLeaveServerModal = (open: boolean) => {
    setLeaveServerModalOpen(open);
    setDropdownOpen(false);
  };

  const toggleInviteModalOpen = () => setInviteModalOpen(!inviteModalOpen);

  const topLevelChannel = server.categories[0].channels[0]; // could give error if no channels

  const handleCreateInvite = async () => {
    const inviteCode = await createInvite(server._id, topLevelChannel);

    setInvite(inviteCode);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="font-semibold">
          <DropdownMenuItem
            onClick={async () => {
              await handleCreateInvite();
              toggleInviteModalOpen();
            }}
            className="text-brand-500 focus:bg-brand-560 hover:bg-brand-560 active:bg-brand-600 active:text-white hover:text-white flex justify-between"
          >
            Invite People
            <CreateInvite />
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => toggleLeaveServerModal(true)}
            className="text-status-danger focus:bg-status-danger active:bg-status-danger/80 hover:bg-status-danger hover:text-white active:text-white"
          >
            Leave Server
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LeaveServerModal
        toggleLeaveServerModal={toggleLeaveServerModal}
        open={leaveServerModalOpen}
        server={server}
        user={user}
      />

      <CreateInviteModal
        inviteCode={invite}
        server={server}
        open={inviteModalOpen}
        onToggleOpen={toggleInviteModalOpen}
        channel={topLevelChannel}
      />
    </>
  );
};

export default ServerDropdown;
