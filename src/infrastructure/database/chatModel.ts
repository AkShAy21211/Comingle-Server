import mongoose, { model, Schema } from "mongoose";
import Chat from "../../domain/entities/chat";


const chatSchema = new Schema<Chat>({


    chatName:{

        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    participants:[{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],

    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true});


const chatModel = model('Chat',chatSchema);

export default chatModel;