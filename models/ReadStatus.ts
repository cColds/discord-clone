import { Schema, model, models, Types, Document } from "mongoose";

export interface ReadStatus extends Document {
  user: Types.ObjectId;
  message: Types.ObjectId;
  read: boolean;
}

const ReadStatusSchema = new Schema<ReadStatus>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  read: { type: Boolean, required: true },
});

const ReadStatusModel =
  models.ReadStatus || model<ReadStatus>("ReadStatus", ReadStatusSchema);

export default ReadStatusModel;
