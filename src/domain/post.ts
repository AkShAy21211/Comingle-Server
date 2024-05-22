import mongoose from "mongoose";

 interface Posts{

    _id:string;
    userId:mongoose.Schema.Types.ObjectId;
    image:string[];
    description:string;
    likes:mongoose.Schema.Types.ObjectId[];
    comments:mongoose.Schema.Types.ObjectId[];
    isHidden:boolean;
    timestamp:Date;
}


export default Posts