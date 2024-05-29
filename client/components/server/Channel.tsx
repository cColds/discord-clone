import ChannelHeader from "./ChannelHeader";

type ChannelProps = {
  channelId: string;
};

const Channel = ({ channelId }: ChannelProps) => {
  return (
    <div className="min-w-0 min-h-0 flex flex-col overflow-hidden bg-background-primary flex-grow">
      <ChannelHeader />
    </div>
  );
};

export default Channel;
