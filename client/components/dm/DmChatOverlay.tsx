import { UserType } from "@/types/user";
import DmNewChatHeader from "./DmNewChatHeader";
import DmMessageBox from "./DmMessageBox";
import DmMainChat from "./DmMainChat";
import { MessageType } from "@/types/message";

type DmChatOverlayType = {
  user: UserType;
  recipient: UserType;
  messages: MessageType[];
};

export default function DmChatOverlay({
  user,
  recipient,
  messages,
}: DmChatOverlayType) {
  return (
    <div className="grow flex flex-col justify-end h-full">
      <div className="overflow-y-scroll overflow-x-hidden">
        <div className="flex flex-col min-h-full items-stretch justify-end">
          <DmNewChatHeader user={user} recipient={recipient} />
          <DmMainChat messages={messages} />
        </div>
      </div>

      <DmMessageBox sender={user} recipient={recipient} />
    </div>
  );
}
