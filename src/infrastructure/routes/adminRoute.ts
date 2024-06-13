import express from "express";;
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
import ReportReposotory from '../repository/reportRepo';


const adminReop = new AdminReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt()


//////////////////// AUTH CONTROLLER ////////////////////////
const authUseCase = new AdminUseCase(adminReop,jwt,bcrypt);
const authController = new AuthController(authUseCase);




////////////////// SUBSCRIPTION PLAN CONTROLLER //////////////////////
const planRepo = new PlanRepo();
const planUseCase = new PlanUserCase(planRepo);
const planController = new PlanController(planUseCase);


////////////////////// MANAGE USERS CONTROLLER /////////////////////////

const userRepo = new UserReposotory();
const userUserCase= new UserUseCase(userRepo);
const userController = new UserController(userUserCase);








const postRepo = new PostReposotory()
const reportRepo = new ReportReposotory()
const postUseCase= new PostUseCase(postRepo,reportRepo);
const postController = new PostController(postUseCase)
const router = express.Router();


router.post('/signin',(req,res)=>{

  authController.signInAdmin(req,res)
});


router.get('/users',(req,res)=>{


  userController.getUsers(req,res)
})


router.get('/subscription/get-plans',(req,res)=>{

planController.getPlansDetails(req,res);

});




router.post('/subscription/create/plan',(req,res)=>{

    planController.createPlan(req,res)

});

router.put('/subscription/update/plan',(req,res)=>{

    planController.updatePlan(req,res)

});


router.patch('/user/block-unblock/:userId',(req,res)=>{

    userController.blockAndUnblaockUser(req,res)

});

router.get('/post/all/:page',(req,res)=>{

    postController.getAlllPosts(req,res)

});

router.patch('/post/hide-unhide/:postId',(req,res)=>{

    postController.hideOrUnhidePost(req,res)

});

export default router