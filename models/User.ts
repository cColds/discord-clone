import { Schema, model, models, Types, Document } from "mongoose";

export interface UserType extends Document {
  username: string;
  displayName: string;
  email: string;
  password: string;
  avatar: string;
  social: {
    friends: Types.ObjectId[];
    pending: Types.ObjectId[];
    blocked: Types.ObjectId[];
  };

  servers: Types.ObjectId[];
  dms: Types.ObjectId[];
}

const UserSchema = new Schema<UserType>(
  {
    username: { type: String, maxlength: 32, required: true },
    displayName: { type: String, maxLength: 32, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    social: {
      friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
      pending: [{ type: Schema.Types.ObjectId, ref: "User" }],
      blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    servers: [{ type: Schema.Types.ObjectId, ref: "Server" }],
    dms: [{ type: Schema.Types.ObjectId, ref: "Dm" }],
  },
  { timestamps: true }
);

const User = models.User || model<UserType>("User", UserSchema);

export default User;
