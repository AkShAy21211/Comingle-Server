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
      let existingUser = await UserModel.findOne({ email: email }).lean();
      return existingUser ? existingUser : null;
      
    } catch (error: any) {
      console.log(error);
    }
  }

  async verifyUserStatus(email: string): Promise<any> {
    try {
      await UserModel.findOneAndUpdate({ email: email }, { isVerified: true }).lean();
    } catch (error) {
      console.log(error);
    }
  }

 async findUserById(id: string): Promise<User | null | undefined> {
    try {
      
      const user = await UserModel.findById(id).select("-password").lean();

      return user? user:null;
    } catch (error) {
      
      console.log(error);
      
    }
  }

    async updateUserProfileImages(id: string, images: any): Promise<User | null | undefined> {
    
      try {
        
        const updateUser = await UserModel.findOneAndUpdate({_id:id},images,{new:true}).lean();

        return updateUser;
      } catch (error) {
        
        console.log(error);
        
      }
  }

  async updateUser(id: string, data: any): Promise<User | null | undefined> {
    try {
      

      const updatesUser  = await UserModel.findOneAndUpdate({_id:id},data,{new:true}).select("-password").lean();

      return updatesUser;
      
    } catch (error) {
      

      console.log(error);
      
    }
  }
  
}

export default UserReposotory;
