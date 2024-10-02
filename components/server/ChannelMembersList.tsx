import { Member } from "@/types/server";
import AvatarMask from "../avatar/AvatarMask";
import { cn } from "@/lib/utils";
import UserProfileModal from "../modals/UserProfileModal";
import { Crown } from "../svgs/Crown";
import ActionTooltip from "../tooltip/ActionTooltip";

type ChannelMembersListProps = {
  members: Member[];
  membersListOpen: boolean;
  ownerId: string;
};

type MemberItemProps = {
  member: Member;
  type: "Online" | "Offline";
  ownerId: string;
};

const MemberItem = ({ member, type, ownerId }: MemberItemProps) => {
  return (
    <div
      className={cn(
        "max-w-[224px] ml-2 py-[1px] text-channels-default transition-none rounded hover:opacity-100",
        { "opacity-30": type === "Offline" }
      )}
      role="listitem"
    >
      <UserProfileModal user={member}>
        <button className="flex items-center border-0 rounded h-[42px] px-2 py-[1px] hover:bg-background-modifier-hover w-full transition-none">
          <div className="flex justify-center items-center shrink-0 w-8 h-8 mr-3">
            <div
              className="w-8 h-8 rounded-[50%]"
              aria-label={`${member.username}, ${member.status}`}
              role="img"
            >
              <AvatarMask
                avatar={member.avatar}
                username={member.displayName}
                status={member.status}
                removeMask={type === "Offline"}
              />
            </div>
          </div>

          <div className="grow overflow-hidden">
            <div className="flex items-center">
              <p className="truncate">{member.displayName}</p>
              {member.id === ownerId && (
                <ActionTooltip content="Server Owner">
                  <div>
                    <Crown className="ml-1 shrink-0 w-[14px] h-[14px] text-warning" />
                  </div>
                </ActionTooltip>
              )}
            </div>
          </div>
        </button>
      </UserProfileModal>
    </div>
  );
};

const ChannelMembersList = ({
  members,
  membersListOpen,
  ownerId,
}: ChannelMembersListProps) => {
  const onlineMembers = members.filter(
    (member) => member.online && member.status !== "Invisible"
  );

  const offlineMembers = members.filter(
    (member) => !member.online || member.status === "Invisible"
  );

  return (
    <aside
      className={cn(
        "flex bg-background-secondary h-full min-w-[240px] max-w-full",
        { hidden: membersListOpen }
      )}
    >
      <div className="shrink-0 pb-5 w-[240px] overflow-y-scroll overflow-x-hidden">
        <ul aria-label="Members" className="">
          <h3 className="pt-6 pr-2 pl-4 h-10 truncate uppercase text-xs tracking-wide font-bold text-channels-default">
            <span className="sr-only">
              {`Online, ${members.length} ${
                members.length > 1 ? "members" : "member"
              }`}
            </span>
            <span aria-hidden={true}>Online — {onlineMembers.length}</span>
          </h3>

          {onlineMembers.map((member) => (
            <MemberItem
              member={member}
              key={member.id}
              type="Online"
              ownerId={ownerId}
            />
          ))}

          {offlineMembers && (
            <h3 className="pt-6 pr-2 pl-4 h-10 truncate uppercase text-xs tracking-wide font-bold text-channels-default">
              <span className="sr-only">
                {`Offline, ${members.length} ${
                  members.length > 1 ? "members" : "member"
                }`}
              </span>
              <span aria-hidden={true}>Offline — {offlineMembers.length}</span>
            </h3>
          )}

          {offlineMembers.map((member) => (
            <MemberItem
              member={member}
              key={member.id}
              type="Offline"
              ownerId={ownerId}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ChannelMembersList;
