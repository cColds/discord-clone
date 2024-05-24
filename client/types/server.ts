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

export type ServerType = {
  _id: string;
  icon?: string;
  serverName: string;
  members: string[];
  categories: {
    _id: string;
    categoryName: string;
    channels: TextOrVoiceChannel[];
  }[];
  channels: TextOrVoiceChannel[];
};
