import { ChevronDown } from "lucide-react";
import { DMPlus } from "@/components/svgs";
import { ServerCategory as ServerCategoryType } from "@/types/server";
import CreateChannelModal from "@/components/modals/server/CreateChannelModal";
import { useState } from "react";
import ActionTooltip from "@/components/tooltip/ActionTooltip";

type ServerCategoryProps = {
  category: ServerCategoryType;
  serverId: string;
};

const ServerCategory = ({ category, serverId }: ServerCategoryProps) => {
  const [createChannelModalOpen, setCreateChannelModalOpen] = useState(false);

  return (
    <li className="pt-4">
      <div className="relative pl-4 pr-2 cursor-pointer h-6 flex items-center justify-between text-channels-default hover:text-interactive-hover">
        <button
          className="grow overflow-hidden border-0"
          aria-expanded="true"
          aria-label={`${category.categoryName} (category)`}
        >
          <ChevronDown className="w-3 h-3 absolute left-0.5 top-1.5" />

          <h3 className="truncate uppercase text-xs leading-4 tracking-[0.02em] font-bold text-left">
            <div className="truncate">{category.categoryName}</div>
          </h3>
        </button>

        <div className="flex items-center justify-center shrink-0">
          <ActionTooltip content="Create Channel">
            <button
              className="block pointer w-[18px] h-18px] border-0 bg-transparent rounded-xs text-sm leading-4"
              aria-label="Create Channel"
              onClick={() => setCreateChannelModalOpen(true)}
            >
              <DMPlus className="w-4 h-4 text-channels-default hover:text-interactive-hover opacity-70" />
            </button>
          </ActionTooltip>
          <CreateChannelModal
            category={category}
            serverId={serverId}
            toggleOpen={setCreateChannelModalOpen}
            open={createChannelModalOpen}
          />
        </div>
      </div>
    </li>
  );
};

export default ServerCategory;
