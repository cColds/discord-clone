import { UserSettingsTabs } from "@/types/user-settings-tabs";
import UserAccount from "./UserAccount";
import { useUser } from "@/app/providers/UserProvider";
import UserProfile from "./UserProfile";
import { UserType } from "@/types/user";

type UserSettingsContentProps = {
  selected: UserSettingsTabs;
  onTabClick: (tabName: UserSettingsTabs) => void;
  onClose: () => void;
};

const UserSettingsContent = ({
  selected,
  onTabClick,
  onClose,
}: UserSettingsContentProps) => {
  const { user, setUser } = useUser();

  const handleUserUpdate = (updatedUser: UserType) => {
    setUser(updatedUser);
  };

  if (!user) return <div>Please log in to view your account</div>;

  return (
    <div className="bg-background-primary flex-grow basis-[800px] h-full scroller">
      <div className="overflow-x-hidden overflow-y-scroll flex h-full">
        {selected === "My Account" ? (
          <UserAccount user={user} onTabClick={onTabClick} onClose={onClose} />
        ) : (
          <UserProfile
            user={user}
            onClose={onClose}
            handleUserUpdate={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default UserSettingsContent;
