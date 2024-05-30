import { TextOrVoiceChannel } from "@/types/server";

type ChannelMainChatProps = {
  channel: TextOrVoiceChannel;
};

const ChannelMainChat = ({ channel }: ChannelMainChatProps) => {
  return (
    <div
      className="relative flex flex-col min-w-0 min-h-0 grow bg-background-primary"
      aria-label={`${channel.name} (channel)`}
    ></div>
  );
};

export default ChannelMainChat;
