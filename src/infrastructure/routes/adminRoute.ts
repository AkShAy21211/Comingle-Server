import express from "express";;
import AuthController from "../../adapters/controllers/admin/authController";
import AdminReposotory from "../repository/adminRepo";
import AdminUseCase from "../../userCase/admin/authUseCase";
import TokenManager from "../utils/generateToken";
import Bcrypt from "../utils/hashPassword";


const adminReop = new AdminReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt()

const authUseCase = new AdminUseCase(adminReop,jwt,bcrypt);

const authController = new AuthController(authUseCase);

const router = express.Router();


router.post('/signin',(req,res)=>{

    authController.signInAdmin(req,res)

});


export default router