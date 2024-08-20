import Image from "next/image";
import { useState } from "react";
import Notification from "../badges/Notification";

type BlobIconProps = {
  url: string;
  acronym: string;
  isSelectedServer: boolean;
  serverId: string;
  notifications: number;
};

const paths = {
  circle:
    "M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z",
  roundedCircle:
    "M0 24C0 16.5449 0 12.8174 1.21793 9.87706C2.84183 5.95662 5.95662 2.84183 9.87706 1.21793C12.8174 0 16.5449 0 24 0C31.4551 0 35.1826 0 38.1229 1.21793C42.0434 2.84183 45.1582 5.95662 46.7821 9.87706C48 12.8174 48 16.5449 48 24C48 31.4551 48 35.1826 46.7821 38.1229C45.1582 42.0434 42.0434 45.1582 38.1229 46.7821C35.1826 48 31.4551 48 24 48C16.5449 48 12.8174 48 9.87706 46.7821C5.95662 45.1582 2.84183 42.0434 1.21793 38.1229C0 35.1826 0 31.4551 0 24Z",
};

function BlobIcon({
  url,
  acronym,
  isSelectedServer,
  serverId,
  notifications,
}: BlobIconProps) {
  const [pathDefinition, setPathDefinition] = useState(
    isSelectedServer ? paths.circle : paths.roundedCircle
  );

  return (
    <div className="w-12 h-12 cursor-pointer relative">
      <svg
        width={48}
        height={48}
        viewBox="0 0 48 48"
        className="w-12 h-12"
        onMouseOver={() => setPathDefinition(paths.roundedCircle)}
        onMouseLeave={() => {
          if (!isSelectedServer) {
            setPathDefinition(paths.circle);
          }
        }}
      >
        <defs>
          <path d={`${pathDefinition}`} id={`${serverId}-blob_mask`}></path>

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
            <div className="bg-background-primary leading-[1.2em] font-semibold whitespace-nowrap flex items-center justify-center w-12 h-12 transition ease-in-out duration-100">
              <span>{acronym}</span>
            </div>
          )}
        </foreignObject>
      </svg>

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
