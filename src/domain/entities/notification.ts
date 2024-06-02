import mongoose from "mongoose";

interface Notifications{

    _id:string;
    userId: mongoose.Types.ObjectId;
    content:string;
    type:string;
    isRead:boolean;
    timestamp:Date;
}

export default Notifications;