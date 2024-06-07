import mongoose from "mongoose";

interface Comment {
  _id: string;
  postId: mongoose.Schema.Types.ObjectId;
  comment: [
    {
      userId: mongoose.Schema.Types.ObjectId;
      comment: string;
    }
  ];
  timestamp: Date;
}

export default Comment;
