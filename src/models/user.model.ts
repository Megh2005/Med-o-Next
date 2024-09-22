import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  _id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

const userSchema: Schema<User> = new Schema<User>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    photoURL: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", userSchema);
