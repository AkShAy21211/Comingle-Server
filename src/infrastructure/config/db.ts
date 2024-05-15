import mongoose from "mongoose";


export const connectDB = ()=>{

   try {
     const mongoUri = process.env.MONGO_URI as string;
    mongoose.connect(mongoUri).then(()=>{


        console.log('Database connected');
        
    }).catch((error)=>{


        console.log(error,'Mongodb connection failed');
        
    })
   } catch (error) {

    console.log(error);
    
    
   }
}