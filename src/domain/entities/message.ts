import mongoose from "mongoose";

interface Message{

    _id:mongoose.Types.ObjectId;
    sender:mongoose.Types.ObjectId;
    files:string[]
    message:string;
    content:string;
    chat:mongoose.Types.ObjectId;
}

export default Message;