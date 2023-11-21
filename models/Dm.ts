import { Schema, model, models, Types, Document } from "mongoose";

export interface Dm extends Document {
  members: Types.ObjectId[];
  messages: Types.ObjectId[];
  channelId: string;
}

const DmSchema = new Schema<Dm>(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    channelId: { type: String, required: true },
  },
  { timestamps: true }
);

const DmModel = models.Dm || model<Dm>("Dm", DmSchema);

export default DmModel;
