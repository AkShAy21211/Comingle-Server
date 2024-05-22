import mongoose, {Schema} from "mongoose";
import  Posts  from "../../domain/post";


const postSchema = new Schema<Posts>({

    userId:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    image:[],
    description:{
        type:String,
        required:false,
        trim:true,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
    }],
    isHidden:{
        type:Boolean,
        default:false,
    }

},{
    timestamps:true
});


const postModel = mongoose.model<Posts>('Post',postSchema);

export default postModel;