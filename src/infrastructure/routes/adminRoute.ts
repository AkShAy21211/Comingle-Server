import express from "express";
import AuthController from "../../adapters/controllers/admin/authController";
import AdminReposotory from "../repository/adminRepo";
import AdminUseCase from "../../userCase/admin/authUseCase";
import TokenManager from "../utils/generateToken";
import Bcrypt from "../utils/hashPassword";

import PlanController from "../../adapters/controllers/admin/planController";
import PlanUserCase from "../../userCase/admin/PlanUseCase";
import PlanRepo from "../repository/PlanRepo";
import UserController from "../../adapters/controllers/admin/userController";
import UserUseCase from "../../userCase/admin/userUseCase";
import UserReposotory from "../repository/userRepo";

import PostController from "../../adapters/controllers/admin/postController";
import PostUseCase from "../../userCase/admin/postUseCase";
import PostReposotory from "../repository/postRepo";
import ReportReposotory from "../repository/reportRepo";
import DashboardController from "../../adapters/controllers/admin/dashboardController";
import DashboardUseCase from "../../userCase/admin/dashboardUseCase";
import SubscriptionRepo from "../repository/subscriptionRepo";
import { authenticate } from "../middleware/auth";
import EngagementReposotory from "../repository/engagementRepo";

const adminReop = new AdminReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt();

//////////////////// AUTH CONTROLLER ////////////////////////
const authUseCase = new AdminUseCase(adminReop, jwt, bcrypt);
const authController = new AuthController(authUseCase);

////////////////// SUBSCRIPTION PLAN CONTROLLER //////////////////////
const planRepo = new PlanRepo();
const subscriptionOrderRepo = new SubscriptionRepo();
const planUseCase = new PlanUserCase(planRepo, subscriptionOrderRepo);
const planController = new PlanController(planUseCase);

////////////////////// MANAGE USERS CONTROLLER /////////////////////////

const userRepo = new UserReposotory();
const userUserCase = new UserUseCase(userRepo);
const userController = new UserController(userUserCase);

const postRepo = new PostReposotory();
const reportRepo = new ReportReposotory();
const postUseCase = new PostUseCase(postRepo, reportRepo);
const postController = new PostController(postUseCase);
const router = express.Router();

//////////////////// DASHBOARD CONTROLLER /////////////////////////////
const engagementRepo = new EngagementReposotory();
const dashboardUseCase = new DashboardUseCase(postRepo, userRepo,engagementRepo);
const dashboardController = new DashboardController(dashboardUseCase);

router.post("/signin", (req, res) => {
  authController.signInAdmin(req, res);
});

router.get("/users", authenticate, (req, res) => {
  userController.adminGetUsers(req, res);
});

router.get("/subscription/get-plans", authenticate, (req, res) => {
  planController.getPlansDetails(req, res);
});

router.post("/subscription/create/plan", authenticate, (req, res) => {
  planController.createPlan(req, res);
});

router.put("/subscription/update/plan", authenticate, (req, res) => {
  planController.updatePlan(req, res);
});

router.get("/subscriptions", authenticate, (req, res) => {
  planController.getSubscriptions(req, res);
});
router.patch("/user/block-unblock/:userId", authenticate, (req, res) => {
  userController.blockAndUnblaockUser(req, res);
});

router.get("/post/all/:page", authenticate, authenticate, (req, res) => {
  postController.getAlllPosts(req, res);
});

router.patch("/post/hide-unhide/:postId", authenticate, (req, res) => {
  postController.hideOrUnhidePost(req, res);
});

router.delete("/post/dismiss/reports/:postId", authenticate, (req, res) => {
  postController.dismissRepotPost(req, res);
});
router.get("/post/reactions/:postId", authenticate, (req, res) => {
  postController.getPostReaction(req, res);
});
router.get("/dashboard/analytics", authenticate, (req, res) => {
  dashboardController.getAnalytics(req, res);
});

export default router;
