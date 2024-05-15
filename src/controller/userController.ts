import { Request,Response } from "express";
import UserUseCase from "../userCase/userUseCase";
import IUserController from "../userCase/interface/user/IuserController";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";


class UserController implements IUserController{

    constructor(private _userUserCase:UserUseCase){}

  async  SignUpAndDendOtp(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> {
       try {


        const signUpResponse = await this._userUserCase.signUpandSendOtp(req.body);

        if(signUpResponse?.status){

            res.cookie("userOtp",signUpResponse.token,{
               expires: new Date(Date.now() + 25892000000),
               secure:true,
               httpOnly:true

            }).status(201)
            .json(signUpResponse)
        }else{

             res.status(400).json(signUpResponse)
        }
        
       } catch (error) {
        console.log(error);
        
       }
    }


    
}




export default UserController;