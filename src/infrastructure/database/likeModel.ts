import mongoose, { Schema } from "mongoose";
import Like from "../../domain/entities/like";

const likeSchame = new Schema<Like>(
  {
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);


const likeModel = mongoose.model('Like',likeSchame);


export default likeModel
