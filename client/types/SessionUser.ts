import { Status } from "./status";

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  status: Status;
  online: boolean;
};
