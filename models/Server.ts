import { Schema, model, models, Types, Document } from "mongoose";

export interface ServerType extends Document {
  serverName: string;
  icon?: string;
  channels: ChannelType[];
  categories: CategoryType[];
  members: Types.ObjectId[];
  invites: InviteType[];
}

type ChannelType = {
  type: "text" | "voice";
  name: string;
  messages: Types.ObjectId[];
};

type CategoryType = {
  categoryName: string;
  channels: ChannelType[];
};

type InviteType = {
  code: string;
  channel: { name: string; id: string };
  serverId: string;
};

const ChannelSchema = new Schema<ChannelType>({
  type: { type: String, enum: ["text", "voice"], required: true },
  name: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const CategorySchema = new Schema({
  categoryName: { type: String, required: true },
  channels: [ChannelSchema],
});

const InviteSchema = new Schema({
  code: { type: String, required: true },
  channel: {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  serverId: { type: String, required: true },
});

const ServerSchema = new Schema(
  {
    serverName: { type: String, required: true },
    icon: String,
    channels: [ChannelSchema],
    categories: [CategorySchema],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    invites: [InviteSchema],
  },
  { timestamps: true }
);

const Server = model<ServerType>(
  "Server",
  models.Server ? undefined : ServerSchema
);

export default Server;
