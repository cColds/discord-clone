import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeaveServerModal from "../modals/server/LeaveServerModal";
import { useState } from "react";
import { ServerType } from "@/types/server";
import { UserType } from "@/types/user";

type ServerDropdownProps = {
  children: React.ReactNode;
  server: ServerType;
  user: UserType;
};

const ServerDropdown = ({ children, server, user }: ServerDropdownProps) => {
  const [leaveServerModalOpen, setLeaveServerModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleLeaveServerModal = (open: boolean) => {
    setLeaveServerModalOpen(open);
    setDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
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
    </>
  );
};

export default ServerDropdown;
