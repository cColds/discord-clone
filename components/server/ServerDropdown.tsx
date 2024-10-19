import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeaveServerModal from "@/components/modals/server/LeaveServerModal";
import { useState } from "react";
import { ServerType } from "@/types/server";
import { UserType } from "@/types/user";
import { CreateInvite, Settings } from "@/components/svgs";
import CreateInviteModal from "@/components/modals/server/CreateInviteModal";
import { createInvite } from "@/lib/db/createInvite";
import { Leave } from "@/components/svgs/Leave";
import ServerSettingsModal from "@/components/modals/server/ServerSettingsModal";

type ServerDropdownProps = {
  children: React.ReactNode;
  server: ServerType;
  user: UserType;
};

const ServerDropdown = ({ children, server, user }: ServerDropdownProps) => {
  const [invite, setInvite] = useState("");
  const [leaveServerModalOpen, setLeaveServerModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [serverModalOpen, setServerModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleLeaveServerModal = (open: boolean) => {
    setLeaveServerModalOpen(open);
    setDropdownOpen(false);
  };

  const toggleServerModal = () => setServerModalOpen(!serverModalOpen);

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
        <DropdownMenuContent className="font-semibold w-[220px]">
          <DropdownMenuItem
            onClick={async () => {
              await handleCreateInvite();
              toggleInviteModalOpen();
            }}
            className="text-text-brand focus:bg-brand-560 hover:bg-brand-560 active:bg-brand-600 active:text-white hover:text-white flex justify-between"
          >
            Invite People
            <CreateInvite className="w-[18px] h-[18px]" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={toggleServerModal}
            className="focus:bg-brand-560 hover:bg-brand-560 active:bg-brand-600 flex justify-between"
          >
            Server Settings
            <Settings className="w-[18px] h-[18px]" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleLeaveServerModal(true)}
            className="flex justify-between text-status-danger focus:bg-status-danger active:bg-status-danger/80 hover:bg-status-danger hover:text-white active:text-white"
          >
            Leave Server
            <Leave className="w-[18px] h-[18px]" />
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

      {serverModalOpen && (
        <ServerSettingsModal
          server={server}
          user={user}
          onToggleOpen={toggleServerModal}
        />
      )}
    </>
  );
};

export default ServerDropdown;
