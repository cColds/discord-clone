import { UserNormal } from "./user";

export type MessageImage = {
  id: string;
  url: string;
  name: string;
  width?: number;
  height?: number;
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

export type OptimisticMessage = MessageType & { pending?: boolean };
