import mongoose from "mongoose";

 interface Posts{

    _id:string;
    userId:mongoose.Schema.Types.ObjectId;
    image:string[];
    description:string;
    isHidden:boolean;
    timestamp:Date;
}


export default Posts