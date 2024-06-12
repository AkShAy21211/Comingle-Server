import { model, Schema } from "mongoose";
import { PlanDetails } from "../../domain/entities/subscription";


const planSchema = new Schema<PlanDetails>({


    title:{

        type:String,
        trim:true
    },
    amount:{
        type:Number,
        default:0
    },
    benefits:{

        type:[String]
    },
    

});

const planModel = model("SubscriptionPlan",planSchema);;


export default planModel