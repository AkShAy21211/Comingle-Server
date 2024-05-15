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

class UserUseCase implements IUserUseCase {
  constructor(
    private _reposotory: IUserReop,
    private _jwt: TokenManager,
    private _bcrypt: Bcrypt,
    private _generateOtp: GenerateOtp,
    private _OtpRepo: OtpReposotory,
    private _sendMail: NodeMailer
  ) {

  }

  async signUpandSendOtp(userData: User): Promise<any> {
    try {

      if(!userData.name || !userData.email || !userData.password){

        return {status:false,message:"All feilds required"}
      }

      const userFound = await this._reposotory.findUserByemail(userData.email);

      if (userFound) {
        return { status: false, message: "User already exists." };
      } else {
        const payload: { email: string; role: string } = {
          email: userData.email,
          role: "user",
        };

        const OTP = this._generateOtp.generateOTP();

         this._sendMail.sendEmail(userData.email, parseInt(OTP));

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1m",
        });

        await this._OtpRepo.createOtpAndCollection(userData.email, OTP);

        const pswdHash = await this._bcrypt.Encryption(userData.password);

        pswdHash ? (userData.password = pswdHash) : "";

        await this._reposotory.saveUserToDb(userData);

        return { status: true, token: jwtToken};
      }
    } catch (error:any) {


      console.log('error occured',error.message);
      
    }
  }
}



export default UserUseCase;