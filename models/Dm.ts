import { Schema, model, models, Types, Document } from "mongoose";

export interface DmType extends Document {
  members: Types.ObjectId[];
  messages: Types.ObjectId[];
  channelId: string;
}

const DmSchema = new Schema<DmType>(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    channelId: { type: String, required: true },
  },
  { timestamps: true }
);

const Dm = models.Dm || model<DmType>("Dm", DmSchema);

export default Dm;
