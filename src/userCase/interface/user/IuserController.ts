import { Request,Response } from "express";


interface IUserController{

    SignUpAndDendOtp(req:Request,res:Response):Promise<void>;
    VerifyUserByEmailOtp(req:Request,res:Response):Promise<void>;
    ResendOtp(req:Request,res:Response):Promise<void>;
    SignInUser(req:Request,res:Response):Promise<void>;
    GetUserProfile(req:Request,res:Response):Promise<void>;
    UpdateUserPofileImages(req:Request,res:Response):Promise<void>;
    UpdateUserDetails(req:Request,res:Response):Promise<void>;
    
}




export default IUserController;