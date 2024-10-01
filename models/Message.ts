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

MessageSchema.index({ channelId: 1 }); // Improve performance for queries filtering by channelId
MessageSchema.index({ sender: 1 }); // Index for queries filtering by sender
MessageSchema.index({ "timestamps.createdAt": 1 }); // Index for sorting by creation time
MessageSchema.index({ readBy: 1 }, { background: true }); // Multikey index for the readBy array

const Message = model<MessageType>(
  "Message",
  models.Message ? undefined : MessageSchema
);

export default Message;
