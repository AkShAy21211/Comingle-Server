import { Request, Response } from "express";
import ProfileUseCase from "../../../userCase/user/profileUseCase";
import { uploadSingle } from "../../../infrastructure/utils/uploadToCloudnary";

class ProfileController {
  constructor(private _profileUseCase: ProfileUseCase) {}

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {


      
      const userResponse = await this._profileUseCase.getUserProfile(
        req.user?.id as string
      );

      

      if (userResponse.status) {
        res.status(200).json(userResponse);
      } else {
        res.status(400).json("User not found");
      }
    } catch (error: any) {
      res.status(500).json(error.message);
      console.log(error);
    }
  }



  async updateUserPofileImages(req: Request, res: Response): Promise<void> {
    try {

      const image: Express.Multer.File = req.file as Express.Multer.File;


      const updateUserResponse =
        await this._profileUseCase.updateUserProfileImages(
          req.user?.id as string,
          image,
          req.body.type
        );

      if (updateUserResponse.status) {
        res.status(200).json(updateUserResponse);
      }

    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }



  async updateUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const updateUserResponse = await this._profileUseCase.updateUserDetails(
        req.user?.id as string,
        req.body
      );

      if (updateUserResponse.status) {
        res.status(200).json(updateUserResponse);
      } else {
        res.status(400).json(updateUserResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async forgotassword(req: Request, res: Response): Promise<void> {
    try {
      const forgetResponse = await this._profileUseCase.forgotPassword(
        req.body.email
      );

      if (forgetResponse.status) {
        res.cookie("token", forgetResponse.token, {
          expires: new Date(Date.now() + 6 * 60 * 1000),
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        });

        res.status(200).json(forgetResponse);
      } else {
        res.status(400).json(forgetResponse);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  }

  async setNewPassword(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;
      console.log(req.cookies);



      

      const updatedResponse = await this._profileUseCase.setNewPassWord(
        token,
        req.body.password
      );

      if (updatedResponse.status) {
        res.clearCookie("token");
        res.status(200).json(updatedResponse);
      } else {
        res.status(400).json(updatedResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }
}

export default ProfileController;
