import { createPortal } from "react-dom";
import UserSettingsSidebar from "../sidebars/UserSettingsSidebar";
import UserSettingsContent from "./UserSettingsContent";
import { useEffect, useState } from "react";
import { UserSettingsTabs } from "@/types/user-settings-tabs";

type UserSettingsProps = {
  onClose: () => void;
};

const UserSettings = ({ onClose }: UserSettingsProps) => {
  const [selected, setSelected] = useState<UserSettingsTabs>("My Account");

  const handleTabClick = (tabName: UserSettingsTabs) => setSelected(tabName);

  useEffect(() => {
    const closeSettings = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeSettings);
  }, []);

  return (
    <div>
      {createPortal(
        <>
          <div className="absolute z-50 flex bg-background-primary top-0 left-0 bottom-0 right-0 scroller">
            <UserSettingsSidebar
              onTabClick={handleTabClick}
              selected={selected}
            />

            <UserSettingsContent
              selected={selected}
              onTabClick={handleTabClick}
              onClose={onClose}
            />
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default UserSettings;
