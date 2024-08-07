import { Request, Response } from "express";
import ProfileUseCase from "../../../userCase/user/profileUseCase";

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
      const token = req.cookies.token || req.body.token;

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

  async getOtherUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const userResponse =
        await this._profileUseCase.getOtherUserProfile(username);
      if (userResponse) {
        res.status(200).json(userResponse);
      } else {
        res.status(400).json(userResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }

  async searchUser(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;

      const usersResponse = await this._profileUseCase.searchUser(
        name as string,
        req.user?.id as string
      );

      if (usersResponse.status) {
        res.status(200).json(usersResponse);
      } else {
        res.status(400).json(usersResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }

  async changePasswordOtpVerification(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      const sendOtpResponse =
        await this._profileUseCase.sendVerificationOtp(email);

      if (sendOtpResponse.status) {
        res.status(200).json(sendOtpResponse);
      } else {
        res.status(400).json(sendOtpResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }
  async verifyUserByEmailOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      const verifyOtpResponse = await this._profileUseCase.verifyUserByEmailOtp(
        email,
        otp
      );

      if (verifyOtpResponse.status) {
        res.status(200).json(verifyOtpResponse);
      } else {
        res.status(400).json(verifyOtpResponse);
      }
    } catch (error) {
      console.log(error);

      res.status(500).json({ mesage: "Internal server error" });
    }
  }
}

export default ProfileController;
