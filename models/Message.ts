import { Schema, model, models, Types, Document } from "mongoose";

export interface MessageType extends Document {
  sender: Types.ObjectId;
  message: string;
}

const MessageSchema = new Schema<MessageType>(
  {
    sender: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, maxLength: 2000, required: true },
  },
  { timestamps: true }
);

const Message = model<MessageType>(
  "Message",
  models.Message ? undefined : MessageSchema
);

export default Message;