import express from "express";;
import AdminController from "../../controller/adminController";
import AdminReposotory from "../repository/adminRepo";
import AdminUseCase from "../../userCase/adminUseCase";
import TokenManager from "../utils/generateToken";
import Bcrypt from "../utils/hashPassword";


const adminReop = new AdminReposotory();
const jwt = new TokenManager();
const bcrypt = new Bcrypt()

const adminUseCase = new AdminUseCase(adminReop,jwt,bcrypt);

const adminController = new AdminController(adminUseCase);

const router = express.Router();


router.post('/signin',(req,res)=>{

    adminController.SignInAdmin(req,res)

});


export default router