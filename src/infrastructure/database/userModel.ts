import mongoose, { Schema } from "mongoose";
import User from "../../domain/user";

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: {
        image: String,
        bio: String,
        age: Number,
        country: String,
        gender: String,
        isPremium: Boolean,
        followers: Number,
        following: Number,
        posts: Number,
      },
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
