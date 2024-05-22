import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import createAdmin from "../utils/createAdmin";
import userRoute from "../routes/userRoute";
import adminRote from "../routes/adminRoute";
import fileUpload from "express-fileupload";

export const expressServer = () => {
  try {
    const app = express();
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
   
    createAdmin();

    //====cors =====//

    app.use(
      cors({
        origin: [process.env.FRONTEND_URL as string, "http://192.168.1.4:5173"],
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
      })
    );

    app.use("/user", userRoute);
    app.use("/admin", adminRote);

    const server = http.createServer(app);

    return server;
  } catch (error: any) {
    console.log(error.message);
  }
};
