import { SessionUser } from "./SessionUser";
import { SocialPopulated } from "./social";

export type DmType = {
  members: UserType[];
  messages: { sender: UserType[]; message: string }[];
  _id: string;
};

export type UserDms = {
  dms: {
    channel: DmType;
    recipient: UserType;
    open: boolean;
    id: string;
  }[];
};

export type UserType = SessionUser & SocialPopulated & UserDms;
