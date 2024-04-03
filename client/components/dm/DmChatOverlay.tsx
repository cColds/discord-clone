import { UserType } from "@/types/user";
import DmNewChatHeader from "./DmNewChatHeader";
import DmMessageBox from "./DmMessageBox";
import DmMainChat from "./DmMainChat";

type DmChatOverlayType = {
  user: UserType;
  recipient: UserType;
};

export default function DmChatOverlay({ user, recipient }: DmChatOverlayType) {
  return (
    <div className="grow flex flex-col justify-end">
      <DmNewChatHeader user={user} recipient={recipient} />

      <DmMainChat />

      <DmMessageBox sender={user} recipient={recipient} />
    </div>
  );
}
