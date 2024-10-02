import { cn } from "@/lib/utils";
import Notification from "../badges/Notification";
import Pill from "../pill/Pill";
import ActionTooltip from "../tooltip/ActionTooltip";
import Link from "next/link";
import { FramerMotionOptions } from "@/types/FramerMotionOptions";
import { animate, MotionValue, motion } from "framer-motion";
import { circle, roundedCircle } from "@/utils/constants/svgPaths";
import { useState } from "react";

type HomeLinkProps = {
  hoveredServer: string;
  serverId?: string;
  pendingRequests: number;
  options: FramerMotionOptions;
  onHoveredServer: (serverId: string) => void;
};

const paths = [circle, roundedCircle];

export default function HomeLink({
  hoveredServer,
  serverId,
  pendingRequests,
  options,
  onHoveredServer,
}: HomeLinkProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  let motionPath: string | MotionValue<string> = paths[0];

  const isHomeSelected = hoveredServer === "/" || serverId === undefined;
  if (isHomeSelected) {
    motionPath = paths[1];
  } else if (isAnimating) {
    motionPath = options.path;
  }

  const handleHoverStart = () => {
    onHoveredServer("/");
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
    <div className="flex justify-center relative">
      {isHomeSelected && <Pill selected={!serverId} />}
      <div className="flex justify-center mb-2 w-12 h-12 relative">
        <ActionTooltip content="Direct Messages" side="right">
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            overflow="visible"
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          >
            <defs>
              <motion.path
                d={motionPath}
                id="768bde72-aaab-4d1d-b8c9-adf60835f8c5-blob_mask"
              ></motion.path>
              <rect
                id="768bde72-aaab-4d1d-b8c9-adf60835f8c5-upper_badge_masks"
                x="28"
                y="-4"
                width="24"
                height="24"
                rx="12"
                ry="12"
                transform="translate(20 -20)"
              ></rect>
              <rect
                id="768bde72-aaab-4d1d-b8c9-adf60835f8c5-lower_badge_masks"
                x="28"
                y="28"
                width="24"
                height="24"
                rx="12"
                ry="12"
                transform="translate(0 0)"
              ></rect>
            </defs>
            <mask
              id="768bde72-aaab-4d1d-b8c9-adf60835f8c5"
              fill="black"
              x="0"
              y="0"
              width="48"
              height="48"
            >
              <use
                href="#768bde72-aaab-4d1d-b8c9-adf60835f8c5-blob_mask"
                fill="white"
              ></use>
              <use
                href="#768bde72-aaab-4d1d-b8c9-adf60835f8c5-upper_badge_masks"
                fill="black"
              ></use>
              {pendingRequests > 0 && (
                <use
                  href="#768bde72-aaab-4d1d-b8c9-adf60835f8c5-lower_badge_masks"
                  fill="black"
                ></use>
              )}
            </mask>
            <foreignObject
              mask="url(#768bde72-aaab-4d1d-b8c9-adf60835f8c5)"
              x="0"
              y="0"
              width="48"
              height="48"
            >
              <div
                role="treeitem"
                aria-selected={serverId === undefined}
                tabIndex={-1}
                aria-label="Direct Messages"
              >
                <Link
                  href="/"
                  className={cn(
                    "flex justify-center w-12 h-12 items-center transition-all duration-100 bg-dark-700 hover:cursor-pointer",
                    { "bg-primary": serverId === undefined || isAnimating }
                  )}
                >
                  <svg
                    aria-hidden="true"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z"
                    ></path>
                  </svg>
                </Link>
              </div>
            </foreignObject>
          </motion.svg>
        </ActionTooltip>

        {pendingRequests > 0 && (
          <Notification
            pendingRequests={pendingRequests}
            className="absolute bottom-0 right-0"
          />
        )}
      </div>
    </div>
  );
}
