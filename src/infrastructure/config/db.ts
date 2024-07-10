import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV==='DEVELOPMENT'?process.env.MONGO_DEV_URI:process.env.MONGO_URI as string;
    await mongoose.connect(mongoUri as string, {

    });
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
