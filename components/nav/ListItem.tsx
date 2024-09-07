import Link from "next/link";
import ActionTooltip from "../tooltip/ActionTooltip";
import { ServerNavItem } from "@/types/server";
import Pill from "../pill/Pill";
import BlobIcon from "./BlobIcon";
import { FramerMotionOptions } from "@/types/FramerMotionOptions";

type ListItemProps = {
  server: ServerNavItem;
  onHoveredServer: (serverId: string) => void;
  hoveredServer: string;
  isSelectedServer: boolean;
  url: string;
  acronym: string;
  options: FramerMotionOptions;
};

export default function ListItem({
  server,
  onHoveredServer,
  hoveredServer,
  isSelectedServer,
  url,
  acronym,
  options,
}: ListItemProps) {
  const isHovered = hoveredServer === server._id;

  return (
    <div className="flex justify-center w-full mb-2 relative" key={server._id}>
      <ActionTooltip content={server.serverName} side="right">
        <Link
          href={`/channels/servers/${server._id}`}
          aria-label={server.serverName}
          className="cursor-auto border-0"
        >
          <BlobIcon
            url={url}
            acronym={acronym}
            isSelectedServer={isSelectedServer}
            serverId={server._id}
            notifications={0}
            options={options}
            onHoveredServer={onHoveredServer}
          />
        </Link>
      </ActionTooltip>

      {(isHovered || isSelectedServer) && <Pill selected={isSelectedServer} />}
    </div>
  );
}
