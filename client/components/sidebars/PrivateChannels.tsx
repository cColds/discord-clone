import { DMPlus, Friend, Nitro, Shop } from "../svgs";
import ActionTooltip from "../tooltip/ActionTooltip";
import DmItem from "../dm/DmItem";
import Empty from "../svgs/Empty";
import { UserDms } from "@/types/user";
import UpperListItem from "../UpperListItem";

type PrivateChannelsProps = {
  pendingRequests: number;
  dms: UserDms["dms"];
};

export default function PrivateChannels({
  pendingRequests,
  dms,
}: PrivateChannelsProps) {
  return (
    <nav
      className="bg-background-secondary overflow-auto pb-2 grow"
      aria-label="Private channels"
    >
      <div className="flex justify-center h-12 items-center px-2.5 shadow-elevation-low sticky top-0 bg-background-secondary">
        <button className="h-7 bg-background-tertiary rounded-sm text-sm px-1.5 py-[1px] font-medium text-channels-default w-full text-left truncate">
          Find or start a conversation
        </button>
      </div>
      <ul aria-label="Direct Messages" className="mt-2">
        <UpperListItem name="Friends" pendingRequests={pendingRequests}>
          <Friend />
        </UpperListItem>

        <UpperListItem name="Nitro">
          <Nitro />
        </UpperListItem>

        <UpperListItem name="Shop">
          <Shop />
        </UpperListItem>

        <h2 className="text-xs pt-[18px] pr-2 pb-1 pl-[18px] font-semibold leading-3 text-channels-default tracking-[.02em]  flex items-center h-10 truncate hover:text-interactive-hover">
          <span className="grow uppercase">Direct Messages</span>

          <ActionTooltip content="Create DM">
            <button className="w-4 mr-1">
              <DMPlus />
            </button>
          </ActionTooltip>
        </h2>
        {dms.length ? (
          dms.map((dm) => {
            const { recipient } = dm;

            return (
              <DmItem
                key={recipient.id}
                id={recipient.id}
                username={recipient.username}
                status={recipient.status}
                avatar={recipient.avatar}
              />
            );
          })
        ) : (
          <Empty />
        )}
      </ul>
    </nav>
  );
}
