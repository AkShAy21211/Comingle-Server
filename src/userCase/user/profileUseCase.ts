import User from "../../domain/entities/user";
import TokenManager from "../../infrastructure/utils/generateToken";
import Bcrypt from "../../infrastructure/utils/hashPassword";
import IUserReop from "../../domain/interfaces/user/IUserRepo";
import jwt from "jsonwebtoken";
import GenerateOtp from "../../infrastructure/utils/generateOtp";
import OtpReposotory from "../../infrastructure/repository/otpRepo";
import NodeMailer from "../../infrastructure/utils/sendMail";
import IProfileUserCase from "../../domain/interfaces/user/IProfileUseCase";

class ProfileUseCase implements IProfileUserCase {
  constructor(
    private _reposotory: IUserReop,
    private _jwt: TokenManager,
    private _bcrypt: Bcrypt,
    private _generateOtp: GenerateOtp,
    private _OtpRepo: OtpReposotory,
    private _sendMail: NodeMailer
  ) {}

  
  async getUserProfile(id: string): Promise<any> {
    try {
      const userToFind = {

        _id:id
      }
      const user = await this._reposotory.findUserById(userToFind);

      if (user) {
        return {
          status: true,
          user: user,
        };
      } else {
        return {
          status: false,
          message: "User not found",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserProfileImages(
    id: string,
    imagePath: string,
    type: string
  ): Promise<any> {
    try {
      const image = {
        [`${type === "background" ? "profile.background" : "profile.image"}`]:
          imagePath,
      };


     
      

      const updateUser = await this._reposotory.updateUserProfileImages(id, image);


      
      

      if (updateUser) {
        return {
          status: true,
          user: updateUser,
          message: `${type} updated`,
        };
      } else {
        return {
          status: false,
          message: "Something went wrong",
        };
      }
    } catch (error) {}
  }

  async updateUserDetails(id: string, userData: User): Promise<any> {
    try {
      
      const updatedUser = await this._reposotory.updateUser(id, userData);
      

      if (updatedUser) {
        return {
          status: true,
          user: updatedUser,
          message: "Profile updated successfully",
        };
      } else {
        return {
          status: false,
          user: updatedUser,
          message: "Something went wrong",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

 

  async forgotPassword(email: string): Promise<any> {
    try {
      const user = await this._reposotory.findUserByemail(email);

      if (user) {
        const otp = this._generateOtp.generateOTP();
        await this._OtpRepo.createOtpAndCollection(email, otp);
        await this._sendMail.sendEmail(email, parseInt(otp),"One Time Password for Commingle Password Change");
         const payload: { email: string; role: string ,id:string} = {
          id:user._id,
          email: user.email,
          role: "user",
        };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "6m",
        });
        return {
          status: true,
          token:jwtToken,
          message: `OTP sent to ${email}`,
        };
      } else {
        return {
          status: false,
          message: `User not found`,
        };
      }
    } catch (error) {


      console.log(error);
      
    }
  }

  async setNewPassWord(token:string,password: string): Promise<any> {
     
    try {
      const decode =  this._jwt.verifyToken(token)
      if(decode){
        const hashedPassword = await this._bcrypt.Encryption(password);
        const userData = {

          password:hashedPassword
        }
         await this._reposotory.updateUser(decode.id,userData);


         return {
          status:true,
          message:'Password changed sucessfully'
         }
      }else{

          return {
          status:false,
          message:'Something went wrong'
         }
      }
     

    } catch (error) {
      
    }
  }
}

export default ProfileUseCase;
