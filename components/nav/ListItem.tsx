import Link from "next/link";
import ActionTooltip from "../tooltip/ActionTooltip";
import { ServerNavItem } from "@/types/server";
import Pill from "../pill/Pill";
import BlobIcon from "./BlobIcon";

type ListItemProps = {
  server: ServerNavItem;
  onHoveredServer: (serverId: string) => void;
  hoveredServer: string;
  isSelectedServer: boolean;
  url: string;
  acronym: string;
};

export default function ListItem({
  server,
  onHoveredServer,
  hoveredServer,
  isSelectedServer,
  url,
  acronym,
}: ListItemProps) {
  return (
    <div className="flex justify-center w-full mb-2" key={server._id}>
      <ActionTooltip content={server.serverName} side="right">
        <Link
          href={`/channels/servers/${server._id}`}
          aria-label={server.serverName}
          onMouseOver={() => onHoveredServer(server._id)}
          onMouseLeave={() => onHoveredServer("")}
        >
          <BlobIcon
            url={url}
            acronym={acronym}
            isSelectedServer={isSelectedServer}
            serverId={server._id}
            notifications={0}
          />
        </Link>
      </ActionTooltip>

      {(hoveredServer === server._id || isSelectedServer) && (
        <Pill selected={isSelectedServer} />
      )}
    </div>
  );
}
