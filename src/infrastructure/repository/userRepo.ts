import User from "../../domain/user";
import IUserReop from "../../userCase/interface/user/IUserRepo";
import UserModel from "../database/userModel";

class UserReposotory implements IUserReop {
  async saveUserToDb(userData: User): Promise<User | null | undefined> {
    try {
      let newUser = new UserModel(userData);
      await newUser.save();
      return newUser ? newUser.toObject() : null;
    } catch (error: any) {
      console.log(error.message);

      throw new Error("Unable to save user to database");
    }
  }
  async findUserByemail(email: string): Promise<User | null | undefined> {
    try {
      let existingUser = await UserModel.findOne({ email: email });

      return existingUser ? existingUser.toObject() : null;
    } catch (error: any) {
      console.log(error);
    }
  }


  async verifyUserStatus(email: string): Promise<any> {
    
    try {

       await UserModel.findOneAndUpdate({email:email},{isVerified:true});

      
    } catch (error) {
      
      console.log(error);
      
    }
  }
}




export default UserReposotory
