import { Status } from "./status";

export type SocialUser = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
  status: Status;
  online: boolean;
};

export type PendingStatus = {
  user: {
    username: string;
    displayName: string;
    avatar: string;
    id: string;
    status: Status;
    online: boolean;
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
