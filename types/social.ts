import { Status } from "./status";

export type SocialUser = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
  status: Status;
};

type PendingStatus = {
  user: {
    username: string;
    displayName: string;
    avatar: string;
    id: string;
    status: Status;
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
