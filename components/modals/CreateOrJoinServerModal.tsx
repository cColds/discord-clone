import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import CreateServerContent from "./content/CreateServerContent";
import ServerActionContent from "./content/ServerActionContent";
import JoinServerContent from "./content/JoinServerContent";

type CreateOrJoinServerModalType = {
  children: React.ReactNode;
};

const CreateOrJoinServerModal = ({ children }: CreateOrJoinServerModalType) => {
  const [modalMode, setModalMode] = useState<
    null | "Create Server" | "Join Server"
  >(null);
  const [open, setOpen] = useState(false);

  const handleModalChange = (
    modalMode: null | "Create Server" | "Join Server"
  ) => setModalMode(modalMode);

  const toggleModalOpen = () => setOpen(!open);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setModalMode(null);

        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background-primary p-0 rounded-sm w-[440px] max-h-[580px] flex flex-col gap-0">
        {modalMode === null && (
          <ServerActionContent onModalChange={handleModalChange} />
        )}
        {modalMode === "Create Server" && (
          <CreateServerContent
            onModalChange={handleModalChange}
            onToggleModal={toggleModalOpen}
          />
        )}
        {
          modalMode === "Join Server" && (
            <JoinServerContent
              onModalChange={handleModalChange}
              onToggleModal={toggleModalOpen}
            />
          ) /* Change this to join server content */
        }
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrJoinServerModal;
