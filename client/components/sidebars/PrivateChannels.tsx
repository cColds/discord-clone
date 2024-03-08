import Link from "next/link";
import { DMPlus, Friend, Nitro, Shop } from "../svgs";
import { cn } from "@/lib/utils";
import ActionTooltip from "../tooltip/ActionTooltip";
import DmItem from "../dm/DmItem";
import Notification from "../badges/Notification";
import Empty from "../svgs/Empty";
import { UserDms } from "@/types/user";

type UpperListItemProps = {
  children: React.ReactNode;
  name: "Friends" | "Nitro" | "Shop";
  pendingRequests?: number;
};

const UpperListItem = ({
  children,
  name,
  pendingRequests,
}: UpperListItemProps) => {
  const selected = name === "Friends";

  return (
    <li
      className={cn(
        "cursor-pointer flex mx-2 h-11 rounded-[4px] text-channels-default hover:bg-background-interactive-hover my-[1px] hover:text-interactive-hover font-medium pr-2",
        {
          "text-white": selected,
          "bg-background-modifier-selected": selected,
        }
      )}
    >
      <Link href="/" className="flex gap-2 items-center grow">
        <div className="flex items-center px-2 grow">
          <div className="mr-3">{children}</div>
          <p>{name}</p>
        </div>
        {pendingRequests && pendingRequests > 0 ? (
          <Notification pendingRequests={pendingRequests} />
        ) : null}
      </Link>
    </li>
  );
};

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
