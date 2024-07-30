"use client";

import { Search } from "@/components/svgs";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SearchMessage() {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-background-tertiary rounded-sm px-0.5 w-[144px] mx-2">
      <div className="flex items-center py-[1px] grow">
        <input
          type="text"
          className="bg-transparent px-2 h-[24px] w-full text-sm border-0"
          placeholder="Search"
          aria-label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div
          className="flex justify-center items-center shrink-0 mx-1"
          aria-hidden={search === ""}
        >
          <button
            className={cn("text-interactive-normal", {
              "cursor-default": search === "",
              "hover:text-interactive-hover": search !== "",
            })}
            tabIndex={search === "" ? -1 : 0}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
