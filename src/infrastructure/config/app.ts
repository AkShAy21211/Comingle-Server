import express from "express";
import cors from "cors";
import http from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import createDemoUser from "../utils/demoUser";
import createAdmin from "../utils/createAdmin";
import userRoute from "../routes/userRoute";
import adminRote from "../routes/adminRoute";
import "../config/passport";
import connectDB from "./db";
import configureSocket from "./socket";

export const expressServer = () => {
  try {
    const PORT = process.env.PORT || 5000;
    connectDB();
    const app = express();
    const server = http.createServer(app);

    app.use(express.urlencoded({ extended: true }));
    app.use(
      express.json({
        limit: "100mb",
      })
    );
    app.use(cookieParser());
    app.use(passport.initialize());

    createAdmin();
    createDemoUser();

    //====cors =====//

    app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "http://192.168.1.3:5173",
          "https://comingle.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    app.get("/test", (req, res) => {
      res.send("api running successfully");
    });
    //===== routes =====//
    app.use("/user", userRoute);
    app.use("/admin", adminRote);

    configureSocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return server;
  } catch (error: any) {
    console.log(error.message);
  }
};
