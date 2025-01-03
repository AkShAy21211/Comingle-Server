import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === "DEVELOPMENT"
        ? process.env.MONGO_DEV_URI
        : (process.env.MONGO_URI as string);
    await mongoose.connect(mongoUri as string, {
      serverSelectionTimeoutMS: 50000, // Increase timeout to 50 seconds
      socketTimeoutMS: 45000, // Adjust socket timeout
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("error connection db", error);
  }
};

export default connectDB;
