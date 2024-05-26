import mongoose, {Schema } from "mongoose";
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
    phone:{
      type:Number,
      required:false,
    },
    password: {
      type: String,
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
      image: {
        type: String,
      },
      background: {
        type: String,
      },
      bio: {
        type: String,
        default: "",
      },
      age: {
        type: Number,
      },
      country: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        default: "",
      },
      isPremium: {
        type: Boolean,
        default: false,
      },
      followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
      },
    },
    googleId:{
      type:String,
      
    }

  },

  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
