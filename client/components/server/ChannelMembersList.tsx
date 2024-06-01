import { Member } from "@/types/server";
import AvatarMask from "../avatar/AvatarMask";
import { cn } from "@/lib/utils";

type ChannelMembersListProps = {
  members: Member[];
  membersListOpen: boolean;
};

type MemberItemProps = {
  member: Member;
  type: "Online" | "Offline";
};

const MemberItem = ({ member, type }: MemberItemProps) => {
  return (
    <div
      className={cn(
        "max-w-[224px] ml-2 py-[1px] text-channels-default transition-none rounded hover:opacity-100",
        { "opacity-30": type === "Offline" }
      )}
      role="listitem"
    >
      <button className="flex items-center rounded h-[42px] px-2 py-[1px] border-0 hover:bg-background-modifier-hover w-full transition-none">
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
          </div>
        </div>
      </button>
    </div>
  );
};

const ChannelMembersList = ({
  members,
  membersListOpen,
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
      <div className="shrink-0 pb-5 w-[240px]">
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
            <MemberItem member={member} key={member._id} type="Online" />
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
            <MemberItem member={member} key={member._id} type="Offline" />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ChannelMembersList;
