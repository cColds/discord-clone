import { UserNormal } from "./user";

export type MessageType = {
  _id: string;
  message: string;
  channelId: string;
  sender: UserNormal;
  createdAt: string;
  updatedAt: string;
};
