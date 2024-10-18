import { UserType } from "@/types/user";
import { UserSettingsTabs } from "@/types/user-settings-tabs";
import CloseSettings from "@/components/CloseSettings";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type ServerSettingsProps = {
  user: UserType;
  onTabClick: (tabName: UserSettingsTabs) => void;
  onClose: () => void;
};

const UserSettings = ({ onClose }: ServerSettingsProps) => {
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
            <div>Sidebar</div>

            <div>Main Content</div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
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
