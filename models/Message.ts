import { Schema, model, models, Types, Document } from "mongoose";

export interface Message extends Document {
  sender: Types.ObjectId;
  message: string;
}

const MessageSchema = new Schema<Message>(
  {
    sender: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, maxLength: 2000, required: true },
  },
  { timestamps: true }
);

const MessageModel = models.Message || model<Message>("Message", MessageSchema);

export default MessageModel;
