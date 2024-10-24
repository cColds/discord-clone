import { UserType } from "@/types/user";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import ServerSettingsSidebar from "@/components/sidebars/ServerSettingSidebar";
import { ServerSettingsTabs } from "@/types/server-settings-tabs";
import { ServerType } from "@/types/server";
import ServerSettingsContent from "./ServerSettingsContent";
import { useFocusTrap } from "@mantine/hooks";

type ServerSettingsProps = {
  server: ServerType;
  user: UserType;
  onToggleOpen: () => void;
};

const ServerSettingsModal = ({
  server,
  user,
  onToggleOpen,
}: ServerSettingsProps) => {
  const [selected, setSelected] = useState<ServerSettingsTabs>("Overview");

  useEffect(() => {
    const closeSettings = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggleOpen();
    };

    window.addEventListener("keydown", closeSettings);
  }, []);

  const handleTabClick = (tabName: ServerSettingsTabs) => setSelected(tabName);

  const focusTrapRef = useFocusTrap();

  return (
    <div>
      {createPortal(
        <>
          <div
            ref={focusTrapRef}
            className="absolute z-50 flex bg-background-primary top-0 left-0 bottom-0 right-0 scroller"
          >
            <ServerSettingsSidebar
              selected={selected}
              onTabClick={handleTabClick}
              server={server}
              user={user}
            />

            <ServerSettingsContent
              server={server}
              selected={selected}
              onClose={onToggleOpen}
              user={user}
            />
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default ServerSettingsModal;
