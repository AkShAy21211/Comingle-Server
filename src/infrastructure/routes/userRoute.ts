import express from 'express';
import UserController from '../../controller/userController';
import UserUseCase from '../../userCase/userUseCase';
import GenerateOtp from '../utils/generateOtp';
import UserReposotory from '../repository/userRepo';
import TokenManager from '../utils/generateToken';
import Bcrypt from '../utils/hashPassword';
import OtpReposotory from '../repository/otpRepo';
import NodeMailer from '../utils/sendMail';



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
)


const controller = new UserController(userUseCase);

const router  = express.Router();


router.post('/signup',(req,res)=>{

    controller.SignUpAndDendOtp(req,res)
})
router.post('/signup/verify-otp',(req,res)=>{

    controller.VerifyUserByEmailOtp(req,res)
})

router.post('/signup/verify-otp/resend',(req,res)=>{
    
    controller.ResendOtp(req,res)
})


export default router;