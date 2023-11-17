"use client";

import { Clear, Search } from "@/components/svgs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FriendsList from "../FriendsList";

export default function Online() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col grow">
      <div className="bg-background-tertiary rounded-sm  mt-4 mr-5 mb-2 ml-[30px]">
        <div className="flex items-center py-[1px] grow">
          <input
            type="text"
            className="bg-transparent text-channels-default px-2 h-[30px] w-full"
            placeholder="Search"
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div
            className="flex justify-center items-center w-8 h-8 shrink-0"
            aria-hidden={search === ""}
          >
            <button
              className={cn("text-interactive-normal", {
                "cursor-default": search === "",
                "hover:text-interactive-hover": search !== "",
              })}
              tabIndex={search === "" ? -1 : 0}
            >
              {search === "" ? <Search /> : <Clear />}
            </button>
          </div>
        </div>
      </div>

      <FriendsList />
    </div>
  );
}
