import { TextOrVoiceChannel } from "@/types/server";
import ChannelHeader from "./ChannelHeader";
import ChannelMainChat from "./ChannelMainChat";
import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";

type ChannelProps = {
  channelId: string;
  channel: TextOrVoiceChannel;
  user: UserType;
  messages: MessageType[];
};

const Channel = ({ channelId, channel, user, messages }: ChannelProps) => {
  return (
    <div className="min-w-0 min-h-0 flex flex-col overflow-hidden bg-background-primary flex-grow">
      <ChannelHeader channelName={channel.name} />
      <ChannelMainChat channel={channel} user={user} messages={messages} />
    </div>
  );
};

export default Channel;
