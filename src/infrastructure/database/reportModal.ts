import mongoose, { model, Schema } from "mongoose";
import PostReport from '../../domain/entities/repostPost';


const reportSchema = new Schema<PostReport>({

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    reason:{

        type:String,
        trim:true
    }
});

const reportModel = model("Report",reportSchema);

export default reportModel;