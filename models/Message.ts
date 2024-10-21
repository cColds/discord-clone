import { Schema, model, models, Types, Document } from "mongoose";

export interface MessageType extends Document {
  sender: Types.ObjectId;
  message: string;
  channelId: string;
  edited?: Date;
  images: { id: string; url: string; name: string }[];
  readBy: Types.ObjectId[];
  type: "user" | "system";
}

const MessageSchema = new Schema<MessageType>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, maxLength: 2000 },
    channelId: { type: String, required: true },
    edited: { type: Date },
    images: [
      { id: String, url: String, name: String, width: Number, height: Number },
    ],
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    type: {
      type: String,
      enum: ["user", "system"],
      default: "user",
      required: true,
    },
  },

  { timestamps: true }
);

MessageSchema.index({ channelId: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ "timestamps.createdAt": 1 });
MessageSchema.index({ readBy: 1 }, { background: true });

const Message = model<MessageType>(
  "Message",
  models.Message ? undefined : MessageSchema
);

export default Message;
