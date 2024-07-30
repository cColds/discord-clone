"use client";

import { cn } from "@/lib/utils";
import Notification from "./badges/Notification";
import { usePathname } from "next/navigation";
import Link from "next/link";

type UpperListItemProps = {
  children: React.ReactNode;
  name: "Friends" | "Nitro" | "Shop";
  pendingRequests?: number;
};

const UpperListItem = ({
  children,
  name,
  pendingRequests,
}: UpperListItemProps) => {
  const pathname = usePathname();
  const selected = name === "Friends" && pathname === "/";

  return (
    <li
      className={cn(
        "cursor-pointer flex mx-2 h-11 rounded-[4px] text-channels-default hover:bg-background-interactive-hover my-[1px] hover:text-interactive-hover font-medium pr-2",
        {
          "text-white": selected,
          "bg-background-modifier-selected": selected,
        }
      )}
    >
      <Link href="/" className="flex gap-2 items-center grow">
        <div className="flex items-center px-2 grow">
          <div className="mr-3">{children}</div>
          <p>{name}</p>
        </div>
        {pendingRequests && pendingRequests > 0 ? (
          <Notification pendingRequests={pendingRequests} />
        ) : null}
      </Link>
    </li>
  );
};

export default UpperListItem;
