import User from "../domain/user";
import TokenManager from "../infrastructure/utils/generateToken";
import Bcrypt from "../infrastructure/utils/hashPassword";
import IUserReop from "./interface/user/IUserRepo";
import IUserUseCase from "./interface/user/IUserUseCase";
import jwt from "jsonwebtoken";
import IMail from "./interface/email/IMail";
import GenerateOtp from "../infrastructure/utils/generateOtp";
import OtpReposotory from "../infrastructure/repository/otpRepo";
import NodeMailer from "../infrastructure/utils/sendMail";
import Otp from "../domain/opt";

class UserUseCase implements IUserUseCase {
  constructor(
    private _reposotory: IUserReop,
    private _jwt: TokenManager,
    private _bcrypt: Bcrypt,
    private _generateOtp: GenerateOtp,
    private _OtpRepo: OtpReposotory,
    private _sendMail: NodeMailer
  ) {}

  async signUpandSendOtp(userData: User) {
    try {
      if (!userData.name || !userData.email || !userData.password) {
        return { status: false, message: "All feilds required" };
      }

      const userFound = await this._reposotory.findUserByemail(userData.email);

      if (userFound) {
        return { status: false, message: "User already exists please login." };
      } else {
        const payload: { email: string; role: string } = {
          email: userData.email,
          role: "user",
        };

        const OTP = this._generateOtp.generateOTP();

        this._sendMail.sendEmail(userData.email, parseInt(OTP));

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "2m",
        });

        await this._OtpRepo.createOtpAndCollection(userData.email, OTP);

        const pswdHash = await this._bcrypt.Encryption(userData.password);

        pswdHash ? (userData.password = pswdHash) : "";

        await this._reposotory.saveUserToDb(userData);

        return { status: true, token: jwtToken };
      }
    } catch (error: any) {
      console.log("error occured", error.message);
    }
  }

  async verifyUserByEmailOtp(token: string, otp: string) {
    const decodeToken = this._jwt.verifyToken(token);
    try {
      if (decodeToken) {
        const userOtp = await this._OtpRepo.getOtp(decodeToken.email);

        if (userOtp) {
          if (userOtp?.otp === otp) {
            const userToken = this._jwt.createToken(decodeToken._id, "user");
            await this._reposotory.verifyUserStatus(decodeToken.email);
            const userData = await this._reposotory.findUserByemail(
              decodeToken.email
            );

            return {
              status: true,
              userData,
              token: userToken,
              message: `Verfication success welcome to comingle ${userData?.name}`,
            };
          } else {
            return {
              status: false,
              message: "Ivalid OTP",
            };
          }
        } else {
          return {
            status: false,
            message: "OTP has expired",
          };
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async resendOtp(token: string): Promise<any> {
    try {
      const decodeToken = this._jwt.verifyToken(token);
      if (decodeToken) {
        const otp = this._generateOtp.generateOTP();
        await this._OtpRepo.createOtpAndCollection(decodeToken?.email, otp);
        await this._sendMail.sendEmail(decodeToken?.email, parseInt(otp));
        return {status:true, message:`New OTP has send to ${decodeToken?.email}`}
      }else{
        return {status:false, message:`Something went wrong `}
      }
    } catch (error) {

      console.log(error);
      
    }
  }


async signinUser(email: string, password: string): Promise<any> {
  try {
    const findUser = await this._reposotory.findUserByemail(email);

    if (!findUser) {
      return { status: false, message: 'User does not exist. Please register.' };
    }

    if (findUser.isBlocked) {
      return { status: false, message: 'You have been blocked by admin.' };
    }

    const matchPassword = await this._bcrypt.Decryption(password, findUser.password);

    if (!matchPassword) {
      return { status: false, message: 'Invalid login credentials.' };
    }

    const token = this._jwt.createToken(findUser._id, 'user');

    return { status: true, token: token,userData:findUser, message: 'Login successful.' };

  } catch (error) {
    console.error('Error during user sign-in:', error);
    return { status: false, message: 'An error occurred during sign-in. Please try again later.' };
  }
}

}

export default UserUseCase;
