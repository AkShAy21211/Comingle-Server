import { Request, Response } from "express";
import AuthUseCase from "../../../userCase/admin/authUseCase";





class AuthController  {
  constructor(private _authUseCase: AuthUseCase) {}

  async signInAdmin(req: Request, res: Response): Promise<void> {
    try {
      const signUpResponse = await this._authUseCase.signInAdmin(req.body);

      if (signUpResponse?.status) {
        res
          .cookie("adminToken", signUpResponse.token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
            httpOnly: true,
          })
          .status(200)
          .json(signUpResponse);
      }else{

        res.status(401).json(signUpResponse)
      }
    } catch (error) {

        res.status(500).json({message:"Interal server error"});
    }
  }



}


export default AuthController;