import { SessionUser } from "./SessionUser";
import { SocialPopulated } from "./social";

export type DmType = {
  members: UserType[];
  messages: { sender: UserType[]; message: string }[];
};

export type UserDms = {
  dms: {
    channelId: DmType;
    recipientId: UserType;
    open: boolean;
    id: string;
  }[];
};

export type UserType = SessionUser & SocialPopulated & UserDms;
