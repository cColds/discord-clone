import { Status } from "./status";

export type SocialDms = {
  channel: string;
  recipient: string;
  open: boolean;
  id: string;
}[];

export type SocialUser = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
  status: Status;
  online: boolean;
  dms: SocialDms;
};

export type PendingStatus = {
  user: {
    username: string;
    displayName: string;
    avatar: string;
    id: string;
    status: Status;
    online: boolean;
    dms: SocialDms;
  };

  request: "Incoming" | "Outgoing";
};

export type SocialPopulated = {
  social: {
    friends: SocialUser[];
    pending: PendingStatus[];
    blocked: SocialUser[];
  };
};
