import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI as string;
    await mongoose.connect(mongoUri, {

    });
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
