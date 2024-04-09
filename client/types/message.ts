import { UserNormal } from "./user";

export type MessageType = {
  _id: string;
  message: string;
  channelId: string;
  sender: UserNormal;
  edited?: Date;
  createdAt: string;
  updatedAt: string;
};
