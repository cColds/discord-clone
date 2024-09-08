import Image from "next/image";
import Notification from "../badges/Notification";
import { animate, motion, MotionValue } from "framer-motion";
import { FramerMotionOptions } from "@/types/FramerMotionOptions";
import { circle, roundedCircle } from "@/utils/constants/svgPaths";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BlobIconProps = {
  url: string;
  acronym: string;
  isSelectedServer: boolean;
  serverId: string;
  notifications: number;
  options: FramerMotionOptions;
  onHoveredServer: (serverId: string) => void;
};

const paths = [circle, roundedCircle];

function BlobIcon({
  url,
  acronym,
  isSelectedServer,
  serverId,
  notifications,
  options,
  onHoveredServer,
}: BlobIconProps) {
  let motionPath: string | MotionValue<string> = paths[0];
  const [isAnimating, setIsAnimating] = useState(false);

  if (isSelectedServer) {
    motionPath = paths[1];
  } else if (isAnimating) {
    motionPath = options.path;
  }

  const handleHoverStart = () => {
    onHoveredServer(serverId);
    setIsAnimating(true);

    options.progress.stop();

    animate(options.progress, 1, {
      duration: 0.2,
      ease: "linear",
    });
  };

  const handleHoverEnd = () => {
    onHoveredServer("");

    animate(options.progress, 0, {
      duration: 0.2,
      ease: "linear",
    }).then(() => {
      setIsAnimating(false);
    });
  };

  return (
    <div className="w-12 h-12 cursor-pointer relative">
      <motion.svg
        width={48}
        height={48}
        viewBox="0 0 48 48"
        className="w-12 h-12"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        <defs>
          <motion.path d={motionPath} id={`${serverId}-blob_mask`} />

          {notifications && (
            <rect
              id={`${serverId}-lower_badge_masks`}
              x="28"
              y="28"
              width="24"
              height="24"
              rx="12"
              ry="12"
              transform="translate(0 0)"
            ></rect>
          )}
        </defs>

        <mask id={serverId} fill="black" x="0" y="0" width="48" height="48">
          <use href={`#${serverId}-blob_mask`} fill="white"></use>
          <use href={`#${serverId}-lower_badge_masks`} fill="black"></use>
        </mask>

        <foreignObject
          x={0}
          y={0}
          width={48}
          height={48}
          mask={`url(#${serverId})`}
        >
          {url ? (
            <div className="flex items-center justify-center w-12 h-12 transition ease-in-out duration-100">
              <Image
                width={48}
                height={48}
                alt=""
                src={url}
                aria-hidden={true}
                className="object-cover pointer-events-none"
              />
            </div>
          ) : (
            <div
              className={cn(
                "bg-background-primary leading-[1.2em] font-semibold whitespace-nowrap flex items-center justify-center w-12 h-12 transition ease-in-out duration-100",
                {
                  "bg-primary": isSelectedServer || isAnimating,
                }
              )}
            >
              <span>{acronym}</span>
            </div>
          )}
        </foreignObject>
      </motion.svg>

      {notifications > 0 && (
        <Notification
          pendingRequests={notifications}
          className="absolute bottom-0 right-0"
        />
      )}
    </div>
  );
}

export default BlobIcon;
