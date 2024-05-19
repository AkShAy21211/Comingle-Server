import mongoose from "mongoose";
import Admin from "../../domain/admin";


const adminSchema = new mongoose.Schema<Admin>({

    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:false,
    }
});


const adminModel = mongoose.model<Admin>('admin',adminSchema);


export default adminModel;