import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import DmHeader from "./DmHeader";
import DmNewChatHeader from "./DmNewChatHeader";
import DmMainChat from "./DmMainChat";
import DmMessageBox from "./DmMessageBox";

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
      <div className="scroller grow flex flex-col justify-end h-full">
        <DmHeader recipient={recipient} />

        <div className="overflow-y-scroll overflow-x-hidden grow">
          <div className="flex flex-col min-h-full items-stretch justify-end">
            <DmNewChatHeader user={user} recipient={recipient} />
            <DmMainChat messages={messages} />
          </div>
        </div>

        <DmMessageBox sender={user} recipient={recipient} />
      </div>
    </div>
  );
}
