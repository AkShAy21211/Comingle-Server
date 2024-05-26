import { json, Request, Response } from "express";
import UserUseCase from "../userCase/userUseCase";
import IUserController from "../userCase/interface/user/IuserController";
import passport from "passport";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}
class UserController implements IUserController {
  constructor(private _userUserCase: UserUseCase) {}

  async SignUpAndDendOtp(req: Request, res: Response): Promise<void> {
    try {
      const signUpResponse = await this._userUserCase.signUpandSendOtp(
        req.body
      );

      if (signUpResponse?.status) {
        console.log(signUpResponse);

        res.cookie("token", signUpResponse.token, {
          expires: new Date(Date.now() + 25892000000),
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        });

        console.log("agter registration", req.cookies.token);

        res.status(201).json({ status: signUpResponse.status });
      } else {
        res.status(400).json(signUpResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }

  async VerifyUserByEmailOtp(req: Request, res: Response): Promise<void> {
    try {
      const userToken = req.cookies.token;

      console.log(userToken);

      const verifyOtpResponse = await this._userUserCase.verifyUserByEmailOtp(
        userToken,
        req.body.otp
      );

      if (verifyOtpResponse?.status) {
        res.status(200).json(verifyOtpResponse);
      } else {
        res.status(400).json(verifyOtpResponse);
      }
    } catch (error) {
      console.log(error);

      res.status(500).json({ mesage: "Internal server error" });
    }
  }

  async ResendOtp(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;

      console.log(token);

      const resendResponse = await this._userUserCase.resendOtp(token);

      if (resendResponse?.status) {
        res.status(200).json(resendResponse);
      } else {
        res.status(400).json(resendResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  async SignInUser(req: Request, res: Response): Promise<void> {
    try {
      const loginResponse = await this._userUserCase.signinUser(
        req.body.email,
        req.body.password
      );

      if (loginResponse.status) {
        res.status(200).json(loginResponse);
      } else {
        res.status(400).json(loginResponse);
      }
    } catch (error: any) {
      res.status(500).json(error.message);

      console.log(error);
    }
  }

  async LoginWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const googleSignUpResponse = await this._userUserCase.googleLogin(
        req.user
      );
      console.log(googleSignUpResponse);

      if (!googleSignUpResponse) {
        res.status(401).json({ message: "Authentication failed" });
      }

      res.cookie("token", googleSignUpResponse.token, {
        expires: new Date(Date.now() + 25892000000),
        secure: false,
        httpOnly: true,
        sameSite: "strict",
      });

      res
        .status(200)
        .redirect(
          `http://localhost:5173/login/success?token=${googleSignUpResponse.token}`
        );
    } catch (error) {}
  }

  async GetUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userResponse = await this._userUserCase.getUserProfile(
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

  async UpdateUserPofileImages(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.file?.path);

      const updateUserResponse =
        await this._userUserCase.updateUserProfileImages(
          req.user?.id as string,
          req.file?.path as string,
          req.body.type
        );

      if (updateUserResponse.status) {
        res.status(200).json(updateUserResponse);
      } else {
        res.status(400).json(updateUserResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }

  async UpdateUserDetails(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);

      const updateUserResponse = await this._userUserCase.updateUserDetails(
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

  async Forgotassword(req: Request, res: Response): Promise<void> {
    try {
      const forgetResponse = await this._userUserCase.forgotPassword(
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

  async SetNewPassword(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;
      const updatedResponse = await this._userUserCase.setNewPassWord(
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

export default UserController;
