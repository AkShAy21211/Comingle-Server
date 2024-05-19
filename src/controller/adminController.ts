import { Request, Response } from "express";
import IAdminController from "../userCase/interface/admin/adminIController";
import AdminUseCase from "../userCase/adminUseCase";

class AdminController implements IAdminController {
  constructor(private _adminUseCase: AdminUseCase) {}

  async SignInAdmin(req: Request, res: Response): Promise<void> {
    try {
      const signUpResponse = await this._adminUseCase.signInAdmin(req.body);

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


export default AdminController;