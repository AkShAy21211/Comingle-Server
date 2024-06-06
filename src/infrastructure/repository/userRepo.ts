import User from "../../domain/entities/user";
import IUserReop from "../../domain/interfaces/user/IUserRepo";
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
      console.log(existingUser);
    } catch (error: any) {
      console.log(error);
    }
  }

  async verifyUserStatus(email: string): Promise<any> {
    try {
      await UserModel.findOneAndUpdate(
        { email: email },
        { isVerified: true }
      ).lean();
    } catch (error) {
      console.log(error);
    }
  }

  async findUserById(userToFind: {googleId?:string,_id?:string}): Promise<User | null | undefined> {
    try {
      const user = await UserModel.findOne(userToFind).select("-password").lean();

      return user ? user : null;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserProfileImages(
    id: string,
    image:{image?:string}
  ): Promise<User | null | undefined> {
    try {



      const updateUser = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: image},
        { new: true }
      ).lean();

      return updateUser;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(id: string, data: any): Promise<User | null | undefined> {
    try {
      const user = await UserModel.findById(id);

      const updatesUser = await UserModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "profile.age": data.age || user?.profile.age,
            "profile.gender": data.gender || user?.profile.gender,
            "profile.country":data.country|| user?.profile.country,
            "profile.bio": data.bio || user?.profile.bio,
          },
        },
        { new: true }
      )
        .select("-password")
        .lean();

      return updatesUser;
    } catch (error) {
      console.log(error);
    }
  }



  async createUser(userData: any): Promise<User | null | undefined> {
    try {
      const user = new UserModel(userData);

      await user.save();

      return user.toObject();
    } catch (error) {
      console.log(error);
      
    }
  }

  async getAllUsers(id:string): Promise<User[] | null | undefined> {
    
    try {
      
      const users = await UserModel.find({_id:{$ne:id},isBlocked:false});
    

      return users;
    } catch (error) {
    
      console.log(error);
      
    }

  }
}

export default UserReposotory;
