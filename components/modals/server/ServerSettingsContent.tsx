import CloseSettings from "@/components/CloseSettings";
import { ServerSettingsTabs } from "@/types/server-settings-tabs";
import ServerSettingsOverview from "./ServerSettingsOverview";
import { ServerType } from "@/types/server";
import { UserType } from "@/types/user";

type ServerSettingsContentProps = {
  selected: ServerSettingsTabs;
  onClose: () => void;
  server: ServerType;
  user: UserType;
};

const ServerSettingsContent = ({
  selected,
  onClose,
  server,
  user,
}: ServerSettingsContentProps) => {
  return (
    <div className="bg-background-primary flex-grow basis-[800px] h-full scroller">
      <div className="overflow-x-hidden overflow-y-scroll flex h-full">
        <div className="px-10 pt-14 pb-20">
          {selected === "Overview" && (
            <ServerSettingsOverview server={server} user={user} />
          )}
        </div>

        <div className="ml-auto mt-14 mr-5 w-[60px] shrink-0">
          <CloseSettings onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ServerSettingsContent;
