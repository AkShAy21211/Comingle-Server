import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path:path.resolve(__dirname,"../../../.env")});
console.log('envs',process.env.RAZOR_KEY_ID);

const razorpayInstance = new Razorpay({

    
key_id: process.env.RAZOR_KEY_ID as string,
key_secret: process.env.RAZOR_KEY_SECRET as string

});


export default razorpayInstance