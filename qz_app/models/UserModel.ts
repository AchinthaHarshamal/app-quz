import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  userName: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  userName: { type: String },
  role: { type: String, default: "user" },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
