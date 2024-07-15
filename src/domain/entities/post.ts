import mongoose from "mongoose";

 interface Posts{

    _id:string;
    userId:mongoose.Schema.Types.ObjectId;
    image:string[];
    likes:mongoose.Schema.Types.ObjectId;
    comments:mongoose.Schema.Types.ObjectId;
    description:string;
    isHidden:boolean;
    status:string;
    date:Date;
    timestamp:Date;
}


export default Posts