import express from "express";
import AuthController from "../../adapters/controllers/user/authController";
import AuthUseCase from "../../userCase/user/authUseCase";
import GenerateOtp from "../utils/generateOtp";
import UserReposotory from "../repository/userRepo";
import TokenManager from "../utils/generateToken";
import Bcrypt from "../utils/hashPassword";
import OtpReposotory from "../repository/otpRepo";
import NodeMailer from "../utils/sendMail";
import { authenticate } from "../middleware/auth";
import passport from "passport";
import ProfileController from "../../adapters/controllers/user/profileController";
import ProfileUseCase from "../../userCase/user/profileUseCase";
import InteractionController from "../../adapters/controllers/user/interactionController";
import InteractionUseCase from "../../userCase/user/interactionUseCase";
import FollowReposotory from "../repository/followRepo";
import NotificationRepo from "../repository/notificationRepo";
import PostReposotory from "../repository/postRepo";
import PostUseCase from "../../userCase/user/postUseCase";
import PostController from "../../adapters/controllers/user/postController";
import { multerUploader } from "../middleware/multer";

import SubscriptionController from "../../adapters/controllers/user/subscriptionController";
import SubscriptionUseCase from "../../userCase/user/subscriptionUseCase";
import SubscriptionManager from "../utils/razorpay";
import SubscriptionRepo from "../repository/subscriptionRepo";
import ReportReposotory from "../repository/reportRepo";
import ChatController from "../../adapters/controllers/user/chatController";
import ChatUseCase from "../../userCase/user/chatUseCase";
import ChatReposotory from "../repository/chatRepo";
import MessageReposotory from "../repository/messageRepo";
import PlanRepo from "../repository/PlanRepo";
import EngagementReposotory from "../repository/engagementRepo";
import PostCronJob from "../utils/scheduler";



const generateOTP = new GenerateOtp();
const userReposotory = new UserReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt();
const sendMail = new NodeMailer();
const OtpRepo = new OtpReposotory();
const postRepo = new PostReposotory();

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
  sendMail,
  postRepo
);

const profileController = new ProfileController(profileUseCase);

//////////////////// USER INTERACTION CONTROLLER //////////////////////////////////////

const followRepo = new FollowReposotory();
const notificationRepo = new NotificationRepo();
const engagementRepo = new EngagementReposotory();
const interactionUseCase = new InteractionUseCase(
  followRepo,
  userReposotory,
  notificationRepo,
  followRepo,
  engagementRepo
);
const interactionController = new InteractionController(interactionUseCase);

//////////////// POST CONTROLLER /////////////////////////////

const repostRepo = new ReportReposotory();
const postUseCase = new PostUseCase(
  postRepo,
  notificationRepo,
  repostRepo,
  engagementRepo
);
const postController = new PostController(postUseCase);

////////////////// SUBSCRIPTION CONTROLLER /////////////////////////
const subscriptionMananger = new SubscriptionManager();
const subscriptionRepo = new SubscriptionRepo();
const planRepo = new PlanRepo();
const subscriptionUseCase = new SubscriptionUseCase(
  subscriptionMananger,
  subscriptionRepo,
  planRepo,
  userReposotory
);
const subscriptionController = new SubscriptionController(subscriptionUseCase);

////////////////// CHAT CONTROLLER /////////////////////////////////////

const messageRepo = new MessageReposotory();
const chatRepo = new ChatReposotory();
const chatUseCase = new ChatUseCase(chatRepo, messageRepo);
const chatController = new ChatController(chatUseCase);
const cornJob = new PostCronJob(postUseCase)
cornJob.start()

const router = express.Router();

///////////////// AUTHENTICATION CONTROLLER ROUTES ////////////////////////////////////
router.post("/signup", (req, res) => {
  authController.signUpAndDendOtp(req, res);
});

router.get("/signup", (req, res) => {
  authController.findUsernameExist(req, res);
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

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
  
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    
    authController.loginWithGoogle(req, res);
  }
);

////////////////////    PROFILE CONTROLLER ROUTES ///////////////////////////////////////////

router.get("/profile", authenticate, (req, res) => {
  profileController.getUserProfile(req, res);
});

router.post("/change-password/send-otp", authenticate, (req, res) => {
  profileController.changePasswordOtpVerification(req, res);
});

router.post("/change-password/verify-otp", authenticate, (req, res) => {
  profileController.verifyUserByEmailOtp(req, res);
});



router.patch(
  "/profile/update/cover",
  authenticate,
  multerUploader.single("image"),
  (req, res) => {
    profileController.updateUserPofileImages(req, res);
  }
);

router.patch(
  "/profile/update/dp",
  authenticate,
  multerUploader.single("image"),
  (req, res) => {
    profileController.updateUserPofileImages(req, res);
  }
);

router.patch("/profile/update/info", authenticate, (req, res) => {
  profileController.updateUserDetails(req, res);
});

///////////////////// GET USER FRIENDS ///////////////////////////////////////
router.get("/list-friends/:userId", authenticate, (req, res) => {
  interactionController.getFriends(req, res);
});

router.get("/friends/suggestions", authenticate, (req, res) => {
  interactionController.getFriendsSuggestions(req, res);
});

//////////// forget password ////////////////////
router.post("/forgot-password", (req, res) => {
  profileController.forgotassword(req, res);
});

router.post("/new-password", (req, res) => {
  profileController.setNewPassword(req, res);
});

///////////////// USER FOLLOW/UNFOOLLOW REQUEST ROUTES

router.post("/follow-request", authenticate, (req, res) => {
  interactionController.followUser(req, res);
});

///////////////// GET ALL THE USERS ////////////////////////////////////

router.get("/list-all", authenticate, (req, res) => {
  interactionController.getAllUsers(req, res);
});

/////////////////////////  GET ALL NOTIFICATIONS  ////////////////////////
router.get("/notifications", authenticate, (req, res) => {
  interactionController.getAllNotifications(req, res);
});

//////////////////// GET FOLLOW REQUEST STATUS /////////////////////////////////

router.get(
  "/follow/status/:requesterId/:recipietnetId",
  authenticate,
  (req, res) => {
    interactionController.getFollowRequestStatus(req, res);
  }
);

//////////////////// Accept FOLLOW REQUEST STATUS /////////////////////////////////

router.post(
  "/follow/accept/:followId/:notificationId",
  authenticate,
  (req, res) => {
    interactionController.acceptFollowRequest(req, res);
  }
);

////////////////////  UNFOLLOW USER  /////////////////////////////////

router.patch(
  "/unfollow",
  authenticate,
  (req, res) => {
    interactionController.removeFollowing(req, res);
  }
);

//////////////////// CREATE NEW POSTS /////////////////////////////////

router.post(
  "/new-post",
  authenticate,
  multerUploader.array("images"),
  (req, res) => {
    postController.createNewPost(req, res);
  }
);

//////////////////// GET ALL POSTS////////////////////////////////
router.get("/posts/all", authenticate, (req, res) => {
  postController.getAllPosts(req, res);
});

//////////////////// LIKE POST  /////////////////////////////////

router.put(
  "/posts/like/:postId/:userId/:authorId",
  authenticate,
  (req, res) => {
    postController.likePost(req, res);
  }
);

//////////////////// UNLIKE POST /////////////////////////////////

router.put("/posts/unlike/:postId/:userId/", authenticate, (req, res) => {
  postController.unLikePost(req, res);
});

//////////////////// COMMENT POST  /////////////////////////////////

router.put("/posts/comment/:postId/:userId", authenticate, (req, res) => {
  postController.commentPost(req, res);
});

///////////////////// DELETE POSTS //////////////////////////////////

router.delete("/post/delete/:postId", authenticate, (req, res) => {
  postController.deletePost(req, res);
});

///////////////////// EDIT POSTS //////////////////////////////////

router.patch("/post/edit", authenticate, (req, res) => {
  postController.editPost(req, res);
});



///////////////////////// GET SINGLE POST ////////////////////////////////
router.get("/post/:postId", authenticate, (req, res) => {
  postController.getSinglePost(req, res);
});


////////////////// DELETE/EDIT COMMENT /////////////////////////////////////

router.delete(
  "/comment/delete/:postId/:commentId",
  authenticate,
  (req, res) => {
    postController.deleteComment(req, res);
  }
);
router.patch("/comment/edit/", authenticate, (req, res) => {
  postController.editComment(req, res);
});

router.get("/application/plans/", authenticate, (req, res) => {
  subscriptionController.getPlans(req, res);
});

router.post("/rozarpay/create-premium-order", authenticate, (req, res) => {
  subscriptionController.subscribeToPremium(req, res);
});

router.post("/rozarpay/premium-order/verify", authenticate, (req, res) => {
  subscriptionController.verifySubscriptionOrder(req, res);
});

router.get("/rozarpay/get-key_id", authenticate, (req, res) => {
  subscriptionController.getRazorpayKey(req, res);
});

router.post("/posts/report", authenticate, (req, res) => {
  postController.reportPost(req, res);
});

router.post("/chat/access", authenticate, (req, res) => {
  chatController.accessChat(req, res);
});

router.get("/chat/fetch-all", authenticate, (req, res) => {
  chatController.fetchAllChat(req, res);
});

router.post(
  "/chat/new-message",
  authenticate,
  multerUploader.array("files"),
  (req, res) => {
    chatController.sendMessage(req, res);
  }
);

router.get("/chat/:chatId", authenticate, (req, res) => {
  chatController.fetchAllMessages(req, res);
});

router.get("/profile/:username", authenticate, (req, res) => {
  profileController.getOtherUserProfile(req, res);
});

router.get("/search", authenticate, (req, res) => {
  profileController.searchUser(req, res);
});

router.post("/logout", (req, res) => {
  authController.logout(req, res);
});
export default router;
