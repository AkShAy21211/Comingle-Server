import mongoose from "mongoose";

interface Comment{


    _id:string;
    userId:mongoose.Schema.Types.ObjectId[];
    postId:mongoose.Schema.Types.ObjectId;
    comment:string;
    timestamp:Date
}

export default Comment;