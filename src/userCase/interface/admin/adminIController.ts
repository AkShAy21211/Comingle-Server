import { Request,Response } from "express";

interface IAdminController{


    SignInAdmin(req:Request,res:Response):Promise<void>;

}


export default IAdminController;