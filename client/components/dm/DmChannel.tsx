import { UserType } from "@/types/user";
import DmChatOverlay from "./DmChatOverlay";
import DmHeader from "./DmHeader";

type DmChannelType = {
  user: UserType;
  recipient: UserType;
};

export default function DmChannel({ user, recipient }: DmChannelType) {
  return (
    <div
      className="flex flex-col bg-background-primary grow"
      aria-label="(channel)"
    >
      <DmHeader recipient={recipient} />

      <DmChatOverlay user={user} recipient={recipient} />
    </div>
  );
}
