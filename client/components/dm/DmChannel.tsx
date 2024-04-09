import { DmType, UserType } from "@/types/user";
import DmChatOverlay from "./DmChatOverlay";
import DmHeader from "./DmHeader";
import { MessageType } from "@/types/message";

type DmChannelType = {
  user: UserType;
  recipient: UserType;
  messages: MessageType[];
};

export default function DmChannel({
  user,
  recipient,
  messages,
}: DmChannelType) {
  return (
    <div
      className="flex flex-col bg-background-primary grow"
      aria-label="(channel)"
    >
      <DmHeader recipient={recipient} />

      <DmChatOverlay user={user} recipient={recipient} messages={messages} />
    </div>
  );
}
