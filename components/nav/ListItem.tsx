import ActionTooltip from "../tooltip/ActionTooltip";
import { ServerNavItem } from "@/types/server";
import Pill from "../pill/Pill";
import BlobIcon from "./BlobIcon";
import { FramerMotionOptions } from "@/types/FramerMotionOptions";
import { useRouter } from "next/navigation";
import { getServer } from "@/lib/db/getServer";

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

  const router = useRouter();

  const handleServerClick = async () => {
    const targetServer = await getServer(server._id);

    const topLevelChannelLink = targetServer?.categories[0].channels[0]._id;

    const serverLink =
      `/channels/servers/${server._id}/` +
      (topLevelChannelLink ? topLevelChannelLink : "");

    router.push(serverLink);
  };

  return (
    <div className="flex justify-center w-full mb-2 relative" key={server._id}>
      <ActionTooltip content={server.serverName} side="right">
        <button
          onClick={handleServerClick}
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
        </button>
      </ActionTooltip>

      {(isHovered || isSelectedServer) && <Pill selected={isSelectedServer} />}
    </div>
  );
}
