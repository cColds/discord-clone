import { UserType } from "@/types/user";
import AvatarMask from "../avatar/AvatarMask";
import { ProfileBanner } from "../svgs";
import { format } from "date-fns";
import UserProfileModal from "../modals/UserProfileModal";

type DmSidebarProps = {
  recipient: UserType;
};

function DmSidebar({ recipient }: DmSidebarProps) {
  const recipientJoinDate = format(new Date(recipient.createdAt), "LLL d, y");

  return (
    <div className="w-[340px] h-full bg-background-secondary-alt">
      <div className="flex flex-col overflow-hidden h-full">
        <div className="flex grow flex-col overflow-hidden">
          <header className="relative mb-2 min-h-[159px]">
            <ProfileBanner
              viewBox="0 0 340 120"
              className="min-w-[340px] min-h-[120px]"
            />
            <UserProfileModal user={recipient}>
              <button className="w-20 h-20 absolute top-[82px] left-[22px] rounded-full border-0 group">
                <AvatarMask
                  username={recipient.username}
                  status={recipient.status}
                  avatar={recipient.avatar}
                  svgWidth={92}
                  svgHeight={92}
                  imgWidth={80}
                  imgHeight={80}
                  rectX={60}
                  rectY={60}
                  rectHeight={16}
                  rectWidth={16}
                  maskSize={80}
                  clickable={true}
                />
              </button>
            </UserProfileModal>
          </header>

          <div className="flex flex-col gap-3 mx-4">
            <div className="flex flex-col gap-1 items-start">
              <UserProfileModal user={recipient}>
                <button className="hover:underline border-0">
                  <h2 className="truncate text-header-primary max-h-[72px] text-xl font-semibold leading-5">
                    {recipient.displayName}
                  </h2>
                </button>
              </UserProfileModal>
              <UserProfileModal user={recipient}>
                <button className="hover:underline border-0">
                  <span className="truncate text-header-primary text-sm">
                    {recipient.username}
                  </span>
                </button>
              </UserProfileModal>
            </div>

            <div className="flex flex-col gap-3 p-3 bg-background-floating overflow-hidden rounded-lg">
              <h2 className="text-header-primary text-xs font-bold truncate">
                Member Since
              </h2>

              <p className="text-text-normal text-sm">{recipientJoinDate}</p>
            </div>
          </div>
        </div>

        <footer className="border-t-[1px] border-t-border-subtle">
          <UserProfileModal user={recipient}>
            <button className="border-0 text-interactive-normal hover:text-interactive-hover w-full text-sm leading-4 h-[44px] min-[44px] font-semibold">
              View Full Profile
            </button>
          </UserProfileModal>
        </footer>
      </div>
    </div>
  );
}

export default DmSidebar;
