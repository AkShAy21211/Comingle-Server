import express from "express";
import UserController from "../../controller/userController";
import UserUseCase from "../../userCase/userUseCase";
import GenerateOtp from "../utils/generateOtp";
import UserReposotory from "../repository/userRepo";
import TokenManager from "../utils/generateToken";
import Bcrypt from "../utils/hashPassword";
import OtpReposotory from "../repository/otpRepo";
import NodeMailer from "../utils/sendMail";
import { authenticate } from "../middleware/auth";
import { profileUploader } from "../middleware/multer";
import cookieParser from "cookie-parser";
const generateOTP = new GenerateOtp();
const userReposotory = new UserReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt();
const sendMail = new NodeMailer();
const OtpRepo = new OtpReposotory();

const userUseCase = new UserUseCase(
  userReposotory,
  jwt,
  bcrypt,
  generateOTP,
  OtpRepo,
  sendMail
);

const controller = new UserController(userUseCase);

const router = express.Router();

router.post("/signup", (req, res) => {
  controller.SignUpAndDendOtp(req, res);
});
router.post("/signup/verify-otp", (req, res) => {
  controller.VerifyUserByEmailOtp(req, res);
});

router.post("/signup/verify-otp/resend", (req, res) => {
  controller.ResendOtp(req, res);
});

router.post("/signin", (req, res) => {
  controller.SignInUser(req, res);
});

router.get("/profile", authenticate, (req, res) => {
  controller.GetUserProfile(req, res);
});

router.get("/profile", authenticate, (req, res) => {
  controller.GetUserProfile(req, res);
});

router.patch(
  "/profile/update/cover",
  authenticate,
  profileUploader.single("image"),
  (req, res) => {
    controller.UpdateUserPofileImages(req, res);
  }
);

router.patch(
  "/profile/update/dp",
  authenticate,
  profileUploader.single("image"),
  (req, res) => {
    controller.UpdateUserPofileImages(req, res);
  }
);


router.patch("/profile/update/info",authenticate,(req,res)=>{

  controller.UpdateUserDetails(req,res)
})
export default router;
