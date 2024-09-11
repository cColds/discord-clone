import { STATUS } from "@/utils/constants/status";
import { Status } from "@/types/status";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarMaskProps = {
  avatar: string;
  username: string;
  status: Status;
  removeMask?: boolean;
  svgWidth?: number;
  svgHeight?: number;
  imgWidth?: number;
  imgHeight?: number;
  rectWidth?: number;
  rectHeight?: number;
  rectX?: number;
  rectY?: number;
  maskSize?: 32 | 80 | 120;
  clickable?: boolean;
};

export default function AvatarMask({
  avatar,
  username,
  status,
  removeMask = false,
  svgWidth = 40,
  svgHeight = 40,
  imgWidth = 32,
  imgHeight = 32,
  rectWidth = 10,
  rectHeight = 10,
  rectX = 22,
  rectY = 22,
  maskSize = 32,
  clickable = false,
}: AvatarMaskProps) {
  // todo: add avatar size preset so u dont need a million params

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      aria-hidden="true"
    >
      <foreignObject
        x="0"
        y="0"
        width={imgWidth}
        height={imgHeight}
        mask={
          removeMask ? "" : `url(#svg-mask-avatar-status-round-${maskSize})`
        }
      >
        <div className="w-full h-full">
          <Image
            src={avatar}
            alt={`${username}, ${status}`}
            width={imgWidth}
            height={imgHeight}
            className={cn(
              "rounded-full object-cover transition-opacity duration-200",
              {
                "group-hover:opacity-50": clickable,
              }
            )}
            draggable={false}
          />
        </div>
      </foreignObject>
      {!removeMask && (
        <rect
          width={rectWidth}
          height={rectHeight}
          x={rectX}
          y={rectY}
          fill={STATUS[status].color}
          mask={STATUS[status].mask}
        ></rect>
      )}
    </svg>
  );
}
