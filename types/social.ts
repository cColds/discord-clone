import { Status } from "./status";

export type SocialUser = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
  status: Status;
};

export type SocialPopulated = {
  social: {
    friends: SocialUser[];
    pending: SocialUser[];
    blocked: SocialUser[];
  };
};
