import mongoose, { Document } from "mongoose";

interface Notifications extends Document{

    _id:string;
    userId: mongoose.Types.ObjectId;
    content:string;
    sourceId:mongoose.Types.ObjectId;
    type:string;
    isRead:boolean;
    timestamp:Date;
}

export default Notifications;