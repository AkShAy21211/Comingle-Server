import { Request, Response } from "express";
import UserUseCase from "../userCase/userUseCase";
import IUserController from "../userCase/interface/user/IuserController";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

class UserController implements IUserController {
  constructor(private _userUserCase: UserUseCase) {}

  async SignUpAndDendOtp(req: Request, res: Response): Promise<void> {
    try {
      const signUpResponse = await this._userUserCase.signUpandSendOtp(
        req.body
      );

      if (signUpResponse?.status) {
        res
          .cookie("userToken", signUpResponse.token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
            httpOnly: true,
          })
          .status(201)
          .json(signUpResponse);
      } else {
        res.status(400).json(signUpResponse);
      }
    } catch (error) {
      res.status(500).json({message:"Internal server error"});
      console.log(error);
    }
  }

  async VerifyUserByEmailOtp(req: Request, res: Response): Promise<void> {
    try {

      const userToken  = req.cookies.userToken;
       const verifyOtpResponse = await this._userUserCase.verifyUserByEmailOtp(userToken,req.body.otp);

       if(verifyOtpResponse?.status){

        res
          .cookie("userToken", verifyOtpResponse.token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
            httpOnly: true,
          }).
        status(200).json(verifyOtpResponse)
       }else{

        res.status(400).json(verifyOtpResponse)
       }
    } catch (error) {

      console.log(error);

      res.status(500).json({mesage:"Internal server error"})
      
    }
  }
}

export default UserController;
