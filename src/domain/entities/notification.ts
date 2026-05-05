import mongoose, { Document } from "mongoose";

interface Notifications extends Document{

    userId: mongoose.Types.ObjectId;
    content:string;
    sourceId:mongoose.Types.ObjectId;
    type:string;
    isRead:boolean;
    timestamp:Date;
}

export default Notifications;