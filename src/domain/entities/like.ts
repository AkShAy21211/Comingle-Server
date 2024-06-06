import mongoose from "mongoose";


interface Like{

    _id:string;
    userId:mongoose.Schema.Types.ObjectId[];
    postId:mongoose.Schema.Types.ObjectId;
    timestamp:Date
}


export default Like;