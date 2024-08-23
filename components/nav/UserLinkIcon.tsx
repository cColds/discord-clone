import Link from "next/link";
import BlobIcon from "./BlobIcon";
import ActionTooltip from "../tooltip/ActionTooltip";

type UserLinkIconProps = {
  url: string;
  channelId: string;
  notifications: number;
  displayName: string;
};

const UserLinkIcon = ({
  url,
  channelId,
  notifications,
  displayName,
}: UserLinkIconProps) => {
  return (
    <div className="flex justify-center w-full mb-2 relative">
      <ActionTooltip content={displayName} side="right">
        <Link href={`${process.env.NEXT_PUBLIC_URL}/channels/dms/${channelId}`}>
          <BlobIcon
            url={url}
            acronym=""
            isSelectedServer={false}
            serverId={channelId}
            notifications={notifications}
          />
        </Link>
      </ActionTooltip>
    </div>
  );
};

export default UserLinkIcon;
