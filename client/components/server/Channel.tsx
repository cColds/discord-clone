import { TextOrVoiceChannel } from "@/types/server";
import ChannelHeader from "./ChannelHeader";
import ChannelMainChat from "./ChannelMainChat";
import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import DmMessageBox from "../dm/DmMessageBox";

type ChannelProps = {
  channelId: string;
  channel: TextOrVoiceChannel;
  user: UserType;
  messages: MessageType[];
};

const Channel = ({ channelId, channel, user, messages }: ChannelProps) => {
  return (
    <div className="flex flex-col overflow-hidden bg-background-primary flex-grow h-full scroller">
      <ChannelHeader channelName={channel.name} />

      <ChannelMainChat channel={channel} user={user} messages={messages} />

      <DmMessageBox sender={user} channelName={channel.name} />
    </div>
  );
};

export default Channel;
