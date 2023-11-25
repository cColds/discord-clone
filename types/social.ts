export type SocialUser = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
  status: "Online" | "Invisible" | "Do Not Disturb" | "Idle";
};

export type SocialPopulated = {
  social: {
    friends: SocialUser[];
    pending: SocialUser[];
    blocked: SocialUser[];
  };
};
