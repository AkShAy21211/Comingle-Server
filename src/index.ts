import { expressServer } from "./infrastructure/config/app";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Suppress unnecessary console logs in production
if (process.env.NODE_ENV === "production") {
  console.log = function (...args: any[]) {
    // Still log actual Errors to console.error for debugging
    if (args.length > 0 && args[0] instanceof Error) {
      console.error(...args);
    }
  };
  console.info = function () {};
}

const startServer = async () => {
  try {
    expressServer();
  } catch (error) {
    console.error(error);
  }
};

startServer();
