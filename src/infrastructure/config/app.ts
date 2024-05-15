import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import userRoute from "../routes/userRoute";

dotenv.config();


export const expressServer = ()=>{


    try{

        const app = express();
        app.use(express.json({limit:"50mb"}));
        app.use(express.urlencoded({extended:true}));
        app.use(cookieParser());
        

        //====cors =====//

        app.use(cors({

            origin:process.env.FRONTEND_URL,
            methods:['GET','POST','PUT','PATCH','DELETE'],
            credentials:true,
        })
    );

    app.use('/user',userRoute);

  
    const server  = http.createServer(app);



    return server;

    }catch(error:any){


        console.log(error.message);
        
    }
}
