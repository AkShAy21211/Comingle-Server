import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:path.resolve(__dirname,'../../.env')});



   
cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CD_API_KEY, 
        api_secret: process.env.CD_API_SECREAT
});



export default cloudinary;
