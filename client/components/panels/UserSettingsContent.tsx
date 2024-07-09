import { UserSettingsTabs } from "@/types/user-settings-tabs";
import UserAccount from "./UserAccount";
import { useUser } from "@/app/providers/UserProvider";

type UserSettingsContentProps = {
  selected: UserSettingsTabs;
  onTabClick: (tabName: UserSettingsTabs) => void;
};

const UserSettingsContent = ({
  selected,
  onTabClick,
}: UserSettingsContentProps) => {
  const { user } = useUser();

  if (!user) return <div>Please log in to view your account</div>;

  return (
    <div className="bg-background-primary flex-grow basis-[800px] h-full scroller">
      <div className="overflow-x-hidden overflow-y-scroll flex h-full">
        {selected === "My Account" && (
          <UserAccount user={user} onTabClick={onTabClick} />
        )}
      </div>
    </div>
  );
};

export default UserSettingsContent;
