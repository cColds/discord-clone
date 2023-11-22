export type SessionUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  status: "Online" | "Idle" | "Do Not Disturb" | "Invisible" | "Offline";
};
