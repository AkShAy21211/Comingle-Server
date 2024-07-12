import User from "../../domain/entities/user";
import TokenManager from "../../infrastructure/utils/generateToken";
import Bcrypt from "../../infrastructure/utils/hashPassword";
import IUserReop from "../../domain/interfaces/user/IUserRepo";
import jwt from "jsonwebtoken";
import GenerateOtp from "../../infrastructure/utils/generateOtp";
import OtpReposotory from "../../infrastructure/repository/otpRepo";
import NodeMailer from "../../infrastructure/utils/sendMail";
import IProfileUserCase from "../../domain/interfaces/user/IProfileUseCase";
import { uploadProfile } from "../../infrastructure/utils/uploadToCloudnary";
import { log } from "console";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";

class ProfileUseCase implements IProfileUserCase {
  constructor(
    private _reposotory: IUserReop,
    private _jwt: TokenManager,
    private _bcrypt: Bcrypt,
    private _generateOtp: GenerateOtp,
    private _OtpRepo: OtpReposotory,
    private _sendMail: NodeMailer,
    private _postRepo: IPostRepo
  ) {}

  async getUserProfile(id: string): Promise<any> {
    try {
      const userToFind = {
        _id: id,
      };
      const user = await this._reposotory.findUserById(userToFind);
      const posts = await this._postRepo.findPostsByUser(user?._id as string);

      if (user) {
        return {
          status: true,
          user: user,
          posts: posts,
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
    images: Express.Multer.File,
    type: string
  ): Promise<any> {
    try {
      const imagePath = await uploadProfile(images.path, type);

      const image = {
        [`${type === "background" ? "profile.background" : "profile.image"}`]:
          imagePath.url,
      };

      const updateUser = await this._reposotory.updateUserProfileImages(
        id,
        image
      );

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
    } catch (error) {
      console.log(error);
    }
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
        await this._sendMail.sendEmail(
          email,
          parseInt(otp),
          "One Time Password for Commingle Password Change"
        );
        const payload: { email: string; role: string; id: string } = {
          id: user._id,
          email: user.email,
          role: "user",
        };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "6m",
        });
        return {
          status: true,
          token: jwtToken,
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

  async setNewPassWord(token: string, password: string): Promise<any> {
    try {
  
      const decode = this._jwt.verifyToken(token);
      console.log('ddddddddddddddd',decode);
      
      if (decode) {
        const hashedPassword = await this._bcrypt.Encryption(password);
        const userData = {
          password: hashedPassword,
        };
        await this._reposotory.updateUser(decode.id, userData);

        return {
          status: true,
          message: "Password changed sucessfully",
        };
      } else {
        return {
          status: false,
          message: "Something went wrong",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getOtherUserProfile(username: string): Promise<any> {
    try {
      const user = await this._reposotory.getUserByUsername(username);
      const posts = await this._postRepo.findPostsByUser(user?._id as string);

      if (user) {
        return {
          status: true,
          user: user,
          posts: posts,
        };
      }
      return {
        status: false,
        message: "User not found or error",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async searchUser(name: string, currentUser: string): Promise<any> {
    try {
      const users = await this._reposotory.serachUserBynameOrEmail(
        name,
        currentUser
      );

      if (users) {
        return {
          status: true,
          users: users,
        };
      }

      return {
        status: false,
        message: "NO users found",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async sendVerificationOtp(email: string): Promise<any> {
    try {
      const otp = this._generateOtp.generateOTP();

      await this._OtpRepo.createOtpAndCollection(email, otp);

      const response = await this._sendMail.sendEmail(
        email,
        parseInt(otp),
        "Your OTP for changing password"
      );

      return {
        status: true,
        message: `OTP send to ${email}`,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async verifyUserByEmailOtp(email: string, otp: string): Promise<any> {
    try {
      const findOtp = await this._OtpRepo.getOtp(email);

      if (!findOtp?.otp) {
        return {
          status: false,
          message: "OTP has expired",
        };
      }

      if (findOtp.otp !== otp) {
        return {
          status: false,
          message: "Invalid OTP",
        };
      } else {
        return {
          status: true,
          message: "OTP verification successfull",
        };
      }
    } catch (error: any) {
      console.log(error);
    }
  }
}

export default ProfileUseCase;
