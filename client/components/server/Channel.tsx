import { TextOrVoiceChannel } from "@/types/server";
import ChannelHeader from "./ChannelHeader";
import ChannelMainChat from "./ChannelMainChat";

type ChannelProps = {
  channelId: string;
  channel: TextOrVoiceChannel;
};

const Channel = ({ channelId, channel }: ChannelProps) => {
  return (
    <div className="min-w-0 min-h-0 flex flex-col overflow-hidden bg-background-primary flex-grow">
      <ChannelHeader channelName={channel.name} />
      <ChannelMainChat channel={channel} />
    </div>
  );
};

export default Channel;
