import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next-nprogress-bar";
import { useUser } from "@/app/providers/UserProvider";
import { UserNormal, UserType } from "@/types/user";
import AvatarMask from "@/components/avatar/AvatarMask";
import { Edit, Message, ProfileBanner } from "@/components/svgs";
import { Member } from "@/types/server";
import { createOrGetDm } from "@/lib/db/createOrGetDm";
import { getUser } from "@/lib/db/getUser";
import { useParams } from "next/navigation";

type UserProfileModalProps = {
  user: UserType | UserNormal | Member;
  open: boolean;
  onToggleModal: (open: boolean) => void;
};

type UserProfileTabItemProps = {
  selected: boolean;
  label: "About Me" | "Mutual Friends" | "Mutual Servers";
};

const UserProfileTabItem = ({ selected, label }: UserProfileTabItemProps) => {
  return (
    <button
      role="tab"
      aria-label={label}
      aria-selected={selected}
      className={cn(
        "border-t-0 border-x-0 border-b-[1px] rounded-none text-text-normal h-[25px] truncate text-sm",
        {
          "cursor-default": selected,
          "border-b-interactive-active": selected,
          "hover:border-b-interactive-hover": !selected,
        }
      )}
    >
      {label}
    </button>
  );
};

function UserProfileModal({
  user,
  open,
  onToggleModal,
}: UserProfileModalProps) {
  const userJoinDate = format(new Date(user.createdAt), "LLL d, y");
  const { user: yourAccount, setUser } = useUser();

  const router = useRouter();
  const params = useParams();
  const isYourAccount = user.id === yourAccount?.id;
  const handleMessageClick = async () => {
    const dm = await createOrGetDm(yourAccount?.id || "", user.id);
    if (params?.channelId === dm._id) {
      onToggleModal(false);
      return;
    }

    const dmLink = `/channels/dms/${dm._id}`;
    router.push(dmLink);

    const getUpdatedUser = await getUser(yourAccount?.id);
    if (getUpdatedUser) setUser(getUpdatedUser);
  };

  return (
    <Dialog onOpenChange={onToggleModal} open={open}>
      <DialogContent
        removeCloseButton={true}
        className="p-0 gap-0 bg-transparent border-0 w-[600px] h-[780px] max-w-none bg-background-secondary-alt rounded-lg overflow-hidden"
      >
        <div className="bg-surface-overlay h-full overflow-hidden flex flex-col">
          <DialogTitle>
            <VisuallyHidden.Root>User Profile</VisuallyHidden.Root>
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden.Root></VisuallyHidden.Root>
          </DialogDescription>
          <header>
            <ProfileBanner
              viewBox="0 0 600 210"
              className="min-h-[210px] min-w-[600px]"
              userProfile={true}
              url={user.avatar}
            />

            <div className="flex px-4 pt-4 relative min-h-[38px]">
              <div className="absolute -top-[66px] left-6 h-[120px] w-[120px]">
                <AvatarMask
                  username={user.username}
                  status={user.status}
                  avatar={user.avatar}
                  svgWidth={138}
                  svgHeight={138}
                  imgWidth={120}
                  imgHeight={120}
                  rectX={88}
                  rectY={88}
                  rectHeight={24}
                  rectWidth={24}
                  maskSize={120}
                />
              </div>

              {isYourAccount ? (
                <button
                  className="flex items-center gap-1 border-0 ml-auto font-semibold px-4 py-0.5 text-sm bg-button-secondary-background hover:bg-button-secondary-background-hover active:bg-button-secondary-background-active transition duration-200 min-w-[60px] min-h-[32px] h-8"
                  aria-label="Message"
                  type="button"
                >
                  <div className="truncate flex items-center gap-1 border-0">
                    <Edit className="w-[18px] h-[18px]" />
                    Edit Profile
                  </div>
                </button>
              ) : (
                <button
                  className="flex items-center gap-1 border-0 ml-auto font-semibold px-4 py-0.5 text-sm bg-button-secondary-background hover:bg-button-secondary-background-hover active:bg-button-secondary-background-active transition duration-200 min-w-[60px] min-h-[32px] h-8"
                  aria-label="Message"
                  type="button"
                  onClick={handleMessageClick}
                >
                  <div className="truncate flex items-center gap-1">
                    <Message width={18} height={18} />
                    Message
                  </div>
                </button>
              )}
            </div>
          </header>

          <div className="flex flex-col gap-3 overflow-hidden grow m-4">
            <div>
              <h1 className="max-h-[90px] text-header-primary font-bold overflow-hidden break-words text-2xl">
                {user.displayName}
              </h1>
              <p className="text-sm text-header-primary truncate">
                {user.username}
              </p>
            </div>

            <div className="h-full overflow-hidden flex flex-col rounded-lg scroller bg-mod-faint border-[1px] border-border-faint">
              <div
                role="tablist"
                aria-orientation="horizontal"
                className="flex gap-8 mx-4 mt-4 border-b-[1px] border-background-modifier-accent"
              >
                <UserProfileTabItem label="About Me" selected={true} />
                {!isYourAccount && (
                  <>
                    <UserProfileTabItem
                      label="Mutual Servers"
                      selected={false}
                    />
                    <UserProfileTabItem
                      label="Mutual Friends"
                      selected={false}
                    />
                  </>
                )}
              </div>

              <div className="overflow-x-hidden overflow-y-auto min-h-0 h-full flex flex-col p-4 gap-5">
                <section className="flex flex-col gap-2">
                  <h1 className="text-header-secondary text-xs font-semibold">
                    Member Since
                  </h1>
                  <p className="text-sm text-text-normal">{userJoinDate}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserProfileModal;
