import mongoose, { Schema } from "mongoose";
import Posts from "../../domain/entities/post";

const postSchema = new Schema<Posts>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: [
      {
        url:{
          type:String,
        },
        type:{
          type:String,
        }
      },
    ],
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model<Posts>("Post", postSchema);

export default postModel;
