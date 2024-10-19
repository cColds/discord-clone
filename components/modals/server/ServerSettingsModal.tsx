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

// export default ServerSettings;

// const ServerSettings = ({ user, onTabClick, onClose }: ServerSettingsProps) => {
//   return (
//     <div
//       className="px-10 pb-20 pt-[60px] max-w-[740px] min-w-[460px] min-h-full flex gap-10"
//       role="tabpanel"
//     >
//       <div className="max-w-full">
//         <h2 className="mb-5 text-header-primary text-xl leading-6 font-semibold">
//           Server Overview
//         </h2>
//         <div className="bg-background-tertiary rounded overflow-hidden relative"></div>
//       </div>
//       <div className="mr-10 w-[60px] shrink-0">
//         <CloseSettings onClose={onClose} />
//       </div>
//     </div>
//   );
// };
