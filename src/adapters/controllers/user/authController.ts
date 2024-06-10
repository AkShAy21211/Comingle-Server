import { Request, Response } from "express";
import AuthUseCase from "../../../userCase/user/authUseCase";
import { log } from "console";

class AuthController {
  constructor(private _authUseCase: AuthUseCase) {}

  async signUpAndDendOtp(req: Request, res: Response): Promise<void> {
    try {
      const signUpResponse = await this._authUseCase.signUpandSendOtp(req.body);

      if (signUpResponse?.status) {
        console.log(signUpResponse);

        res.cookie("token", signUpResponse.token, {
          expires: new Date(Date.now() + 25892000000),
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        });

        res.status(201).json({ status: signUpResponse.status });
      } else {
        res.status(400).json(signUpResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }

  async findUsernameExist(req: Request, res: Response): Promise<void> {
    try {
      const username = req.query.username;
      const usernameResponse = await this._authUseCase.findUserByUsername(
        username as string
      );

      console.log(usernameResponse);
      
      if (usernameResponse) {
        res.status(200).json(usernameResponse);
      }
      

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });

      console.log(error);
    }
  }

  async verifyUserByEmailOtp(req: Request, res: Response): Promise<void> {
    try {
      const userToken = req.cookies.token;

      const verifyOtpResponse = await this._authUseCase.verifyUserByEmailOtp(
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

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;

      const resendResponse = await this._authUseCase.resendOtp(token);

      if (resendResponse?.status) {
        res.status(200).json(resendResponse);
      } else {
        res.status(400).json(resendResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  async signInUser(req: Request, res: Response): Promise<void> {
    try {
      const loginResponse = await this._authUseCase.signinUser(
        req.body.email,
        req.body.password
      );

      console.log(req.body.email, req.body.password);

      if (loginResponse.status) {
        res.status(200).json(loginResponse);
      }
    } catch (error: any) {
      res.status(500).json(error.message);

      console.log(error);
    }
  }

  async loginWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const googleSignUpResponse = await this._authUseCase.googleLogin(
        req?.user
      );

      if (!googleSignUpResponse) {
        res.status(401).json({ message: "Authentication failed" });
      }

      res
        .status(200)
        .redirect(
          `http://localhost:5173/login/success?token=${googleSignUpResponse.token}`
        );
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ status: true, message: "Logout successfull" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
}

export default AuthController;
