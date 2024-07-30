import { UserNormal } from "./user";

export type MessageType = {
  _id: string;
  message: string;
  channelId: string;
  sender: UserNormal;
  images: { id: string; url: string; name: string }[];
  edited?: Date;
  createdAt: string;
  updatedAt: string;
};
