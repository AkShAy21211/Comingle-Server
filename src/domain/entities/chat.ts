import mongoose, { Types } from "mongoose";
import User from "./user";
import Message from "./message";

interface Chat {
  _id: mongoose.Schema.Types.ObjectId;
  chatName:string;
  isGroupChat: boolean;
  participants: Types.ObjectId[] | User[];
  latestMessage?: Types.ObjectId | Message;
  groupAdmin?: Types.ObjectId | User;
}

export default Chat;
