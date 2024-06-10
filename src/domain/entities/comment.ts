import mongoose from "mongoose";

interface Comment {
  _id: string;
  postId: mongoose.Schema.Types.ObjectId;
  comment: [
    {
      _id: string;
      userId: mongoose.Schema.Types.ObjectId;
      comment: string;
      createdAt:any;
    }
  ];
}
export interface UpdatedCommetn {
 userId: {
    profile: {
      image: string
    },
    _id: string,
    name: string
  },
  comment:string,
  createdAt: Date,
  _id: string
}
export default Comment;
