import mongoose, { mongo, Schema } from "mongoose";
import Comment from "../../domain/entities/comment";

const commentSchema = new Schema<Comment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
