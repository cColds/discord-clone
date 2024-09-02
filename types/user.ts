import { SessionUser } from "./SessionUser";
import { SocialPopulated } from "./social";
import { Status } from "./status";

export type DmType = {
  members: UserType[];
  _id: string;
  lastMessageTimestamp: Date;
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

export type UserNormal = {
  username: string;
  displayName: string;
  _id: string;
  email: string;
  avatar: string;
  status: Status;
};
