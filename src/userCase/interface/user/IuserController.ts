import { Request,Response } from "express";


interface IUserController{

    SignUpAndDendOtp(req:Request,res:Response):Promise<void>;
}




export default IUserController;