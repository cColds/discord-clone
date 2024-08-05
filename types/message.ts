import { UserNormal } from "./user";

export type MessageImage = {
  id: string;
  url: string;
  name: string;
};

export type MessageType = {
  _id: string;
  message: string;
  channelId: string;
  sender: UserNormal;
  images: MessageImage[];
  edited?: Date;
  createdAt: string;
  updatedAt: string;
};
