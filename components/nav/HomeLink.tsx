import { cn } from "@/lib/utils";
import Notification from "../badges/Notification";
import Pill from "../pill/Pill";
import ActionTooltip from "../tooltip/ActionTooltip";
import Link from "next/link";

type HomeLinkProps = {
  hoveredServer: string;
  serverId?: string;
  pendingRequests: number;
  setHoveredServer: (serverId: string) => void;
};

export default function HomeLink({
  hoveredServer,
  serverId,
  pendingRequests,
  setHoveredServer,
}: HomeLinkProps) {
  return (
    <div className="flex justify-center relative">
      {(hoveredServer === "/" || serverId === undefined) && (
        <Pill selected={!serverId} />
      )}
      <div className="flex justify-center mb-2 w-12 h-12 relative">
        <ActionTooltip content="Direct Messages" side="right">
          <svg width="48" height="48" viewBox="0 0 48 48" overflow="visible">
            <defs>
              <path
                d={
                  serverId === undefined || hoveredServer === "/"
                    ? "M0 24C0 16.5449 0 12.8174 1.21793 9.87706C2.84183 5.95662 5.95662 2.84183 9.87706 1.21793C12.8174 0 16.5449 0 24 0C31.4551 0 35.1826 0 38.1229 1.21793C42.0434 2.84183 45.1582 5.95662 46.7821 9.87706C48 12.8174 48 16.5449 48 24C48 31.4551 48 35.1826 46.7821 38.1229C45.1582 42.0434 42.0434 45.1582 38.1229 46.7821C35.1826 48 31.4551 48 24 48C16.5449 48 12.8174 48 9.87706 46.7821C5.95662 45.1582 2.84183 42.0434 1.21793 38.1229C0 35.1826 0 31.4551 0 24Z"
                    : "M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z"
                }
                id="768bde72-aaab-4d1d-b8c9-adf60835f8c5-blob_mask"
              ></path>
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
                    "flex justify-center w-12 h-12 items-center transition-all duration-100 bg-dark-700 hover:cursor-pointer hover:bg-primary",
                    { "bg-primary": serverId === undefined }
                  )}
                  onMouseOver={() => setHoveredServer("/")}
                  onMouseLeave={() => setHoveredServer("")}
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
          </svg>
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
