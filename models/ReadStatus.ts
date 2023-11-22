import { Schema, model, models, Types, Document } from "mongoose";

export interface ReadStatusType extends Document {
  user: Types.ObjectId;
  message: Types.ObjectId;
  read: boolean;
}

const ReadStatusSchema = new Schema<ReadStatusType>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  read: { type: Boolean, required: true },
});

const ReadStatus = model<ReadStatusType>(
  "ReadStatus",
  models.User ? undefined : ReadStatusSchema
);

export default ReadStatus;
