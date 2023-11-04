import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
}

const UserSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
});

export default mongoose.model<User>(
  "User",
  mongoose.models?.User ? undefined : UserSchema
);
