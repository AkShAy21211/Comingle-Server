import mongoose, { Schema,model } from "mongoose";

const OtpSchema = new Schema({

    otp:{
        type:String,
    },
    email:{
        type:String,

    },
    createdAt:{
        type:Date,
        expires:60,
        default:Date.now()
    }
})

OtpSchema.index({createdAt:1},{expireAfterSeconds:0});

const optModel = mongoose.model('Otp',OtpSchema);


export default optModel;