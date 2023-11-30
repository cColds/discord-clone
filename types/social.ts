import { Status } from "./status";

export type SocialUser = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
  status: Status;
};

// TODO:
// update pending and blocked type schema, because they may have properties like type: {incoming | outgoing} or blocked status

export type SocialPopulated = {
  social: {
    friends: SocialUser[];
    pending: SocialUser[];
    blocked: SocialUser[];
  };
};
