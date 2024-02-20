import Link from "next/link";
import { DMPlus, Friend, Nitro, Shop } from "../svgs";
import { cn } from "@/lib/utils";
import ActionTooltip from "../tooltip/ActionTooltip";
import { Status } from "@/types/status";
import DmItem from "../dm/DmItem";
import Notification from "../badges/Notification";
import Empty from "../svgs/Empty";

type Dms = {
  username: string;
  avatar: string;
  status: Status;
  id: string;
}[];

const dms: Dms = [
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r98h",
  },
  {
    username: "Harmeet Matharoo",
    avatar: "https://avatars.githubusercontent.com/u/39014834?s=32&v=4",
    status: "Invisible",
    id: "dv98h",
  },

  {
    username: "shark",
    avatar: "https://avatars.githubusercontent.com/u/95330865?s=32&v=4",
    status: "Online",
    id: "9823rh",
  },

  {
    username: "Web Dev Simplified",
    avatar: "https://avatars.githubusercontent.com/u/39717099?s=32&v=4",
    status: "Idle",
    id: "43298h",
  },
  {
    username: "Some Meticulously Epic Person !!",
    avatar: "https://avatars.githubusercontent.com/u/51186394",
    status: "Invisible",
    id: "98hn",
  },
];

type UpperListItemProps = {
  children: React.ReactNode;
  name: "Friends" | "Nitro" | "Shop";
  incomingRequests?: number;
};

const UpperListItem = ({
  children,
  name,
  incomingRequests,
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
        {incomingRequests && incomingRequests > 0 ? (
          <Notification incomingRequests={incomingRequests} />
        ) : null}
      </Link>
    </li>
  );
};

type PrivateChannelsProps = {
  incomingRequests: number;
};

export default function PrivateChannels({
  incomingRequests,
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
        <UpperListItem name="Friends" incomingRequests={incomingRequests}>
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
        {true ? (
          <Empty />
        ) : (
          dms.map((dm) => {
            return (
              <DmItem
                key={dm.id}
                id={dm.id}
                username={dm.username}
                status={dm.status}
                avatar={dm.avatar}
              />
            );
          })
        )}
      </ul>
    </nav>
  );
}
