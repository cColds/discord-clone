import { UserType } from "@/types/user";
import AvatarMask from "../avatar/AvatarMask";
import { ProfileBanner } from "../svgs/ProfileBanner";
import { UserSettingsTabs } from "@/types/user-settings-tabs";
import PrimaryButton from "../buttons/PrimaryButton";
import CloseSettings from "../CloseSettings";
import EditUsernameModal from "../modals/user-settings/EditUsernameModal";
import EditEmailModal from "../modals/user-settings/EditEmailModal";
import EditPasswordModal from "../modals/user-settings/EditPasswordModal";

type UserAccountProps = {
  user: UserType;
  onTabClick: (tabName: UserSettingsTabs) => void;
  onClose: () => void;
};

type AccountFieldListProps = {
  label: "Display Name" | "Username" | "Email";
  value: string;
  ariaLabel: string;
  children?: React.ReactNode;
};

const AccountFieldList = ({
  label,
  value,
  children,
}: AccountFieldListProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col grow overflow-hidden mr-4">
        <h3 className="text-header-secondary text-xs font-bold uppercase tracking-wide mb-1">
          {label}
        </h3>

        <span className="text-header-primary text-md leading-5">{value}</span>
      </div>

      {children}
    </div>
  );
};

const UserAccount = ({ user, onTabClick, onClose }: UserAccountProps) => {
  return (
    <div
      className="px-10 pb-20 pt-[60px] max-w-[740px] min-w-[460px] min-h-full flex gap-10"
      role="tabpanel"
    >
      <div>
        <h2 className="mb-5 text-header-primary text-xl leading-6 font-semibold">
          My Account
        </h2>
        <div className="bg-background-tertiary rounded overflow-hidden relative">
          <ProfileBanner
            className="min-w-[660px] min-h-[100px] z-0"
            viewBox="0 0 660 100"
          />
          <div className="w-full flex justify-between pl-[120px] pt-4 pb-7 pr-4">
            <div className="w-20 h-20 absolute top-[82px] left-[22px] rounded-full">
              <AvatarMask
                username={user.username}
                status={user.status}
                avatar={user.avatar}
                svgWidth={92}
                svgHeight={92}
                imgWidth={80}
                imgHeight={80}
                rectX={60}
                rectY={60}
                rectHeight={16}
                rectWidth={16}
                maskSize={80}
              />
            </div>
            <span className="truncate mb-1.5 text-header-primary font-semibold text-xl leading-6">
              {user.displayName}
            </span>
            <PrimaryButton onClick={() => onTabClick("Profiles")}>
              <p>Edit User Profile</p>
            </PrimaryButton>
          </div>
          <div className="rounded-lg bg-background-secondary p-4 mt-2 mr-4 mb-4 ml-4 flex flex-col gap-6">
            <AccountFieldList
              label="Display Name"
              value={user.displayName}
              ariaLabel="Edit display name"
            >
              <button
                aria-label="Edit display name"
                className="bg-button-secondary-background hover:bg-button-secondary-background-hover active:bg-button-secondary-active h-8 min-w-[60px] min-h-[32px] transition duration-150 ease-in-out rounded-sm py-0.5 px-4 text-sm leading-4 border-0"
                type="button"
                onClick={() => onTabClick("Profiles")}
              >
                Edit
              </button>
            </AccountFieldList>
            <AccountFieldList
              label="Username"
              value={user.username}
              ariaLabel="Edit username"
            >
              <EditUsernameModal>
                <button
                  aria-label="Edit username"
                  className="bg-button-secondary-background hover:bg-button-secondary-background-hover active:bg-button-secondary-active h-8 min-w-[60px] min-h-[32px] transition duration-150 ease-in-out rounded-sm py-0.5 px-4 text-sm leading-4 border-0"
                  type="button"
                >
                  Edit
                </button>
              </EditUsernameModal>
            </AccountFieldList>
            <AccountFieldList
              label="Email"
              value={user.email}
              ariaLabel="Edit email address"
            >
              <EditEmailModal>
                <button
                  aria-label="Edit email address"
                  className="bg-button-secondary-background hover:bg-button-secondary-background-hover active:bg-button-secondary-active h-8 min-w-[60px] min-h-[32px] transition duration-150 ease-in-out rounded-sm py-0.5 px-4 text-sm leading-4 border-0"
                  type="button"
                >
                  Edit
                </button>
              </EditEmailModal>
            </AccountFieldList>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-header-primary mb-5 text-xl font-bold leading-6">
            Password and Authentication
          </h2>
          <div className="flex flex-col">
            <div className="mb-7">
              <EditPasswordModal>
                <PrimaryButton>Change Password</PrimaryButton>
              </EditPasswordModal>
            </div>
          </div>
        </div>
      </div>
      <div className="mr-10 w-[60px] shrink-0">
        <CloseSettings onClose={onClose} />
      </div>
    </div>
  );
};

export default UserAccount;
