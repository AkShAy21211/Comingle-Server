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
import configureSocket from "./socket";
export const expressServer = () => {
  try {
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
          "http://localhost:3000",
          "https://comingle.vercel.app",
          "https://comingle.netlify.app",
          "http://localhost:4173",
          "https://comingle.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    app.get("/", (req, res) => {
      res.send("api running successfully");
    });
    app.use("/user", userRoute);
    app.use("/admin", adminRote);

    configureSocket(server);

    return server;
  } catch (error: any) {
    console.log(error.message);
  }
};
