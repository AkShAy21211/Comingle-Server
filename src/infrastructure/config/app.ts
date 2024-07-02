import express from "express";
import cors from "cors";
import http from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import createAdmin from "../utils/createAdmin";
import userRoute from "../routes/userRoute";
import adminRote from "../routes/adminRoute";
import "../config/passport";
import configureSocket from "./socket";
import { ExpressPeerServer } from "peer";
export const expressServer = () => {
  try {
    const app = express();
    const server = http.createServer(app);
    const peerServer = ExpressPeerServer(server, {
      path: "/server", 
    });
    app.use(express.urlencoded({ extended: true }));
    app.use(
      express.json({
        limit: "100mb",
      })
    );
    app.use(cookieParser());
    app.use(passport.initialize());

    createAdmin();

    //====cors =====//

    app.use(
      cors({
        origin: [process.env.FRONTEND_URL as string, "http://192.168.1.4:5173"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    app.use("/user", userRoute);
    app.use("/admin", adminRote);
    app.use("/peerjs", peerServer);

    configureSocket(server);

    return server;
  } catch (error: any) {
    console.log(error.message);
  }
};
