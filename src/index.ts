import { expressServer } from "./infrastructure/config/app";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const startServer = async () => {
  try {
    expressServer();
  } catch (error) {
    console.log(error);
  }
};

startServer();
