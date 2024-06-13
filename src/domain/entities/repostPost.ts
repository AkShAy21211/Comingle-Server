import mongoose from "mongoose";

interface PostReport{

    postId:mongoose.Schema.Types.ObjectId;
    reason:string;

}

export default PostReport