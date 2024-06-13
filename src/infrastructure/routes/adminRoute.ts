import express from "express";;
import AuthController from "../../adapters/controllers/admin/authController";
import AdminReposotory from "../repository/adminRepo";
import AdminUseCase from "../../userCase/admin/authUseCase";
import TokenManager from "../utils/generateToken";
import Bcrypt from "../utils/hashPassword";
import PostController from "../../adapters/controllers/admin/postController";
import PostUseCase from "../../userCase/admin/postUseCase";
import PostReposotory from "../repository/postRepo";
import ReportReposotory from '../repository/reportRepo';


const adminReop = new AdminReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt()

const authUseCase = new AdminUseCase(adminReop,jwt,bcrypt);

const authController = new AuthController(authUseCase);

const postRepo = new PostReposotory()
const reportRepo = new ReportReposotory()
const postUseCase= new PostUseCase(postRepo,reportRepo);
const postController = new PostController(postUseCase)
const router = express.Router();


router.post('/signin',(req,res)=>{

    authController.signInAdmin(req,res)

});



router.get('/post/all/:page',(req,res)=>{

    postController.getAlllPosts(req,res)

});

router.patch('/post/hide-unhide/:postId',(req,res)=>{

    postController.hideOrUnhidePost(req,res)

});

export default router