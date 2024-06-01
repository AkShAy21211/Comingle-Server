import express from "express";
import cors from "cors";
import http from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import createAdmin from "../utils/createAdmin";
import userRoute from "../routes/userRoute";
import adminRote from "../routes/adminRoute";
import '../config/passport'
export const expressServer = () => {
  try {

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(passport.initialize());

    createAdmin();

    //====cors =====//

    app.use(
      cors({
        
        origin: [process.env.FRONTEND_URL as string, "http://192.168.1.4:5173"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        optionsSuccessStatus:200
        
        
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
