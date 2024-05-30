import ToolbarIcon from "../ToolbarIcon";
import SearchMessage from "../search/SearchMessage";
import { Hash, Help, Inbox, MemberList, Pin } from "../svgs";

type ChannelHeaderProps = {
  channelName: string;
};

const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  return (
    <div className="flex flex-col shadow-elevation-low z-30">
      <section
        className="bg-background-primary shrink-0 flex justify-center items-center p-2 min-h-[48px]"
        aria-label="Channel header"
      >
        <div className="flex grow overflow-hidden h-full">
          <div className="grow relative flex items-center overflow-hidden overflow-fade-gradient">
            <div className="h-6 shrink-0 mx-2">
              <Hash className="w-6 h-6 block text-channel-icon" />
            </div>

            <div className="mr-2 shrink-0">
              <h1 className="text-md leading-5 font-semibold overflow-hidden whitespace-nowrap text-header-primary">
                {channelName}
              </h1>
            </div>
          </div>

          <div className="flex items-center shrink-0 min-w-0">
            <ToolbarIcon name="Pinned Messages">
              <Pin />
            </ToolbarIcon>

            <ToolbarIcon name="Hide Member List">
              <MemberList className="text-white" />
            </ToolbarIcon>

            <SearchMessage />

            <ToolbarIcon name="Inbox">
              <Inbox />
            </ToolbarIcon>

            <ToolbarIcon name="Help">
              <Help />
            </ToolbarIcon>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChannelHeader;
