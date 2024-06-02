import mongoose from "mongoose";

interface Follow {
  _id: string;
  requester: mongoose.Schema.Types.ObjectId;
  recipient: mongoose.Schema.Types.ObjectId;
  status:string;
  timestamp?: Date;
}

export default Follow;