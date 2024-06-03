import mongoose, { Schema } from "mongoose";
import Follow from "../../domain/entities/follow";

const followSchea = new Schema<Follow>({

    requester:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        enum:['Pending','Accepted','Ignored'],
        default:'Pending'
    }
},{
    timestamps:true
});


const followModel = mongoose.model('Follow',followSchea);


export default followModel;