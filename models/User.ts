import { Schema, model, models, Types, Document } from "mongoose";

export interface UserType extends Document {
  username: string;
  displayName: string;
  email: string;
  password: string;
  avatar: string;
  status: "Online" | "Idle" | "Do Not Disturb" | "Invisible" | "Offline";
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
    // TODO:
    // - set min length to 2
    // - set unique on email and username
    username: { type: String, maxlength: 32, required: true },
    displayName: { type: String, maxLength: 32, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    status: {
      type: String,
      enum: ["Online", "Idle", "Do Not Disturb", "Invisible", "Offline"],
      default: "Offline",
    },
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

/* 
This is typed loosely: const User = models.User || model<UserType>("User", UserSchema);
The key issue of this problem is that things inside mongoose.models are all typed as Model<any> by default.
The ternary I used will create one, or if it already exists, uses the cached one.
It doesn't use set User to models.User so it won't infer as any.
So that type will be inferred as Model<any> since this is a more broaden type.


Another way to do it:
    const UserModel = model<UserType>("User", UserSchema);
    const User = (models.User as typeof UserModel) || UserModel;
 
Source: https://stackoverflow.com/questions/65887351/how-to-properly-use-mongoose-models-in-next-js
*/

const User = model<UserType>("User", models.User ? undefined : UserSchema);

export default User;
