import { ChevronDown } from "lucide-react";
import { DMPlus } from "../svgs";
import { ServerCategory } from "@/types/server";
import CreateChannelModal from "@/components/modals/server/CreateChannelModal";

type ServerCategoryProps = {
  category: ServerCategory;
  serverId: string;
};

const ServerCategory = ({ category, serverId }: ServerCategoryProps) => {
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
          <CreateChannelModal category={category} serverId={serverId}>
            <button
              className="block pointer w-[18px] h-18px] border-0 bg-transparent rounded-xs text-sm leading-4"
              aria-label="Create Channel"
            >
              <DMPlus className="w-4 h-4 text-channels-default hover:text-interactive-hover opacity-70" />
            </button>
          </CreateChannelModal>
        </div>
      </div>
    </li>
  );
};

export default ServerCategory;
