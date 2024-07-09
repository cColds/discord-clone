import { createPortal } from "react-dom";
import UserSettingsSidebar from "../sidebars/UserSettingsSidebar";
import UserSettingsContent from "./UserSettingsContent";
import { useState } from "react";
import { UserSettingsTabs } from "@/types/user-settings-tabs";

const UserSettings = () => {
  const [selected, setSelected] = useState<UserSettingsTabs>("My Account");

  const handleTabClick = (tabName: UserSettingsTabs) => setSelected(tabName);

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
            />
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default UserSettings;
