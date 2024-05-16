import { Schema, model, models, Types, Document } from "mongoose";

export interface ServerType extends Document {
  serverName: string;
  icon?: string;
  channels: ChannelType[];

  categories: CategoryType[];
  members: Types.ObjectId[];
}

type ChannelType = {
  id: string;
  type: "text" | "voice";
  name: string;
  messages: Types.ObjectId[];
};

type CategoryType = {
  id: string;
  categoryName: string;
  channels: ChannelType[];
};

const ChannelSchema = new Schema<ChannelType>({
  id: { type: String, required: true },
  type: { type: String, enum: ["text", "voice"], required: true },
  name: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const CategorySchema = new Schema({
  id: { type: String, required: true },
  categoryName: { type: String, required: true },
  channels: [ChannelSchema],
});

const ServerSchema = new Schema(
  {
    serverName: { type: String, required: true },
    icon: String,
    channels: [ChannelSchema],
    categories: [CategorySchema],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Server = model<ServerType>(
  "Server",
  models.Server ? undefined : ServerSchema
);

export default Server;
