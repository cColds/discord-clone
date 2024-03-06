import { Schema, model, models, Types, Document } from "mongoose";

export interface DmType extends Document {
  members: Types.ObjectId[];
  messages: Types.ObjectId[];
}

const DmSchema = new Schema<DmType>(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

const Dm = model<DmType>("Dm", models.Dm ? undefined : DmSchema);

export default Dm;
