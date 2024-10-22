import { Status } from "./status";

export type ServerNavItem = {
  _id: string;
  serverName: string;
  icon?: string;
};

export type TextOrVoiceChannel = {
  _id: string;
  type: "text" | "voice";
  name: string;
  messages: string[];
};

export type ServerCategory = {
  _id: string;
  categoryName: string;
  channels: TextOrVoiceChannel[];
};

export type ServerInvite = {
  code: string;
  channel: {
    name: string;
    id: string;
  };
  serverId: string;
};

export type ServerType = {
  _id: string;
  icon?: string;
  serverName: string;
  members: Member[];
  categories: {
    _id: string;
    categoryName: string;
    channels: TextOrVoiceChannel[];
  }[];
  channels: TextOrVoiceChannel[];
  owner: string;
  invites: ServerInvite[];
};

export type Member = {
  id: string;
  displayName: string;
  avatar: string;
  status: Status;
  username: string;
  online: boolean;
  createdAt: string;
};

export type MemberTableType = { owner: string; members: Member[] };
