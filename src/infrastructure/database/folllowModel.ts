import mongoose, { Schema } from "mongoose";

const followSchea = new Schema({

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
        enum:['Pending','Approved','Ignored'],
        default:'Pending'
    }
},{
    timestamps:true
});


const followModel = mongoose.model('Follow',followSchea);


export default followModel;