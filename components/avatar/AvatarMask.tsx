import { STATUS } from "@/constants";
import { Status } from "@/types/status";
import Image from "next/image";

type AvatarMaskProps = {
  avatar: string;
  username: string;
  status: Status;
};

export default function AvatarMask({
  avatar,
  username,
  status,
}: AvatarMaskProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      <foreignObject
        x="0"
        y="0"
        width="32"
        height="32"
        mask="url(#svg-mask-avatar-status-round-32)"
      >
        <div>
          <Image
            src={avatar}
            alt={`${username}, ${status}`}
            width={32}
            height={32}
            className="rounded-full"
            draggable={false}
          />
        </div>
      </foreignObject>
      <rect
        width="10"
        height="10"
        x="22"
        y="22"
        fill={STATUS[status].color}
        mask={STATUS[status].mask}
      ></rect>
    </svg>
  );
}
