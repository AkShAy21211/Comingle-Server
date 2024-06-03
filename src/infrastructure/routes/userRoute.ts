import express from "express";
import AuthController from "../../adapters/controllers/user/authController";
import AuthUseCase from "../../userCase/user/authUseCase";
import GenerateOtp from "../utils/generateOtp";
import UserReposotory from "../repository/userRepo";
import TokenManager from "../utils/generateToken";
import Bcrypt from "../utils/hashPassword";
import OtpReposotory from "../repository/otpRepo";
import NodeMailer from "../utils/sendMail";
import { authenticate } from '../middleware/auth';
import { uploadProfile } from "../utils/uploadToCloudnary";
import passport from 'passport'
import ProfileController from "../../adapters/controllers/user/profileController";
import ProfileUseCase from "../../userCase/user/profileUseCase";
import InteractionController from "../../adapters/controllers/user/interactionController";
import InteractionUseCase from "../../userCase/user/interactionUseCase";
import FollowReposotory from "../repository/followRepo";
import NotificationRepo from "../repository/notificationRepo";
const generateOTP = new GenerateOtp();
const userReposotory = new UserReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt();
const sendMail = new NodeMailer();
const OtpRepo = new OtpReposotory();




///////////////// USER AUTH CONTROLLER ///////////////////////////
const authUseCase = new AuthUseCase(
  userReposotory,
  jwt,
  bcrypt,
  generateOTP,
  OtpRepo,
  sendMail
);

const authController = new AuthController(authUseCase);

///////////////// USER PROFILEcONTROLLER ///////////////////////////////

const profileUseCase = new ProfileUseCase(
  userReposotory,
  jwt,
  bcrypt,
  generateOTP,
  OtpRepo,
  sendMail
)

const profileController = new ProfileController(profileUseCase);



//////////////////// USER INTERACTION CONTROLLER //////////////////////////////////////

const followRepo = new FollowReposotory();
const notificationRepo = new NotificationRepo();
const interactionUseCase = new InteractionUseCase(followRepo,userReposotory,notificationRepo)
const interactionController  = new InteractionController(interactionUseCase);

const router = express.Router();


///////////////// AUTHENTICATION CONTROLLER ROUTES ////////////////////////////////////
router.post("/signup", (req, res) => {
  authController.signUpAndDendOtp(req, res);
});
router.post("/signup/verify-otp", (req, res) => {
  authController.verifyUserByEmailOtp(req, res);
});

router.post("/signup/verify-otp/resend", (req, res) => {
  authController.resendOtp(req, res);
});

router.post("/signin", (req, res) => {
  authController.signInUser(req, res);
});


///////////////// GOOGLE AUTH /////////////////////////////////////////////////////////////


router.get('/auth/google',passport.authenticate("google",{scope:['profile','email']}));

router.get('/auth/google/callback',passport.authenticate("google",{session:false}),(req,res)=>{

  authController.loginWithGoogle(req,res)
});





////////////////////    PROFILE CONTROLLER ROUTES ///////////////////////////////////////////


router.get("/profile", authenticate, (req, res) => {
  profileController.getUserProfile(req, res);
});

router.get("/profile", authenticate, (req, res) => {
  profileController.getUserProfile(req, res);
});

router.patch(
  "/profile/update/cover",
  authenticate,
  uploadProfile,
  (req, res) => {
    profileController.updateUserPofileImages(req, res);
  }
);

router.patch(
  "/profile/update/dp",
  authenticate,
  uploadProfile,
  (req, res) => {
    profileController.updateUserPofileImages(req, res);
  }
);


router.patch("/profile/update/info",authenticate,(req,res)=>{

  profileController.updateUserDetails(req,res)
})





//////////// forget password ////////////////////
router.post('/forgot-password',(req,res)=>{
  profileController.forgotassword(req,res)
})


router.post('/new-password',(req,res)=>{

  profileController.setNewPassword(req,res);
})






///////////////// USER FOLLOW/UNFOOLLOW REQUEST ROUTES

router.post('/follow-request',authenticate,(req,res)=>{

  interactionController.followUser(req,res);
})



///////////////// GET ALL THE USERS ////////////////////////////////////

router.get('/list-all',authenticate,(req,res)=>{

  interactionController.getAllUsers(req,res);
});

/////////////////////////  GET ALL NOTIFICATIONS  ////////////////////////
router.get('/notifications',authenticate,(req,res)=>{
  
  interactionController.getAllNotifications(req,res);
});


router.get('/follow/status/:requesterId/:recipietnetId',authenticate,(req,res)=>{

  interactionController.getFollowRequestStatus(req,res)
})



router.post('/follow/accept/:followId',authenticate,(req,res)=>{

  interactionController.acceptFollowRequest(req,res)
})
export default router;