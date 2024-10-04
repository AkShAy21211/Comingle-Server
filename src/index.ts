import connectDB from "./infrastructure/config/db";
import { expressServer } from "./infrastructure/config/app";
import dotenv from "dotenv";
import path from "path";


dotenv.config({path:path.resolve(__dirname,"../.env")});


const startServer = async ()=>{

    try {
        connectDB()
        const app = expressServer();
        app?.listen(5000,()=>{


            
        });
    } catch (error) {
        console.log(error);
        
    }
}

startServer();



