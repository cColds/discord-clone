import { Status } from "@/types/status";
import { Schema, model, models, Types } from "mongoose";

export interface UserType {
  username: string;
  displayName: string;
  email: string;
  password: string;
  avatar: string;
  status: Status;
  social: {
    friends: Types.ObjectId[];
    pending: {
      user: Types.ObjectId;
      request: "Incoming" | "Outgoing";
    }[];
    blocked: Types.ObjectId[];
  };

  servers: Types.ObjectId[];
  dms: Types.ObjectId[];
}

const UserSchema = new Schema<UserType>(
  {
    username: { type: String, minlength: 2, maxlength: 32, required: true },
    displayName: { type: String, minlength: 2, maxLength: 32, required: true },
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
      pending: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User" },
          request: { type: String, enum: ["Incoming", "Outgoing"] },
        },
      ],
      blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    servers: [{ type: Schema.Types.ObjectId, ref: "Server" }],
    dms: [{ type: Schema.Types.ObjectId, ref: "Dm" }],
  },
  {
    toJSON: { virtuals: true },

    timestamps: true,
  }
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

const User = model<UserType>("User", models?.User ? undefined : UserSchema);

export default User;
