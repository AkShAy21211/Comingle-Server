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
    } catch (error: any) {
      console.log(error);
    }
  }

  async findUsername(username: string): Promise<User | null | undefined> {
    try {
      const user = await UserModel.findOne({ username: username }).lean();
      return user;
    } catch (error) {
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

  async findUserById(userToFind: {
    googleId?: string;
    _id?: string;
  }): Promise<User | null | undefined> {
    try {
      const user = await UserModel.findOne(userToFind)
        .select("-password")
        .lean();

      return user ? user : null;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserProfileImages(
    id: string,
    image: { image?: string }
  ): Promise<User | null | undefined> {
    try {
      const updateUser = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: image },
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
            "profile.country": data.country || user?.profile.country,
            "profile.bio": data.bio || user?.profile.bio,
            password: data.password || user?.password,
            "profile.isPremium": data.premium || user?.profile.isPremium,
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

  async changeUserPassword(id: string, password: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(
        id,
        { $set: { password: password } },
        { new: true }
      ).lean();
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

  async getAllUsers(id: string): Promise<User[] | null | undefined> {
    try {
      const users = await UserModel.find({
        _id: { $ne: id },
        isBlocked: false,
      });

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async addFollowers(
    id: string,
    follower: string
  ): Promise<User | null | undefined> {
    try {
      const updatedFollowers = await UserModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            "profile.followers": follower,
          },
        },
        { new: true, useFindAndModify: false }
      ).lean();

      return updatedFollowers;
    } catch (error) {
      console.log(error);
    }
  }

  async addFollowings(
    id: string,
    following: string
  ): Promise<User | null | undefined> {
    try {
      const updatedFollowers = await UserModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            "profile.following": following,
          },
        },
        { new: true, useFindAndModify: false }
      ).lean();

      return updatedFollowers;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAllUsers(): Promise<User[] | null | undefined> {
    try {
      const users = await UserModel.find({}).lean();

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async blockOrUnblockUser(id: string): Promise<User | null | undefined> {
    try {
      const findUser = await UserModel.findById(id);
      const user = await UserModel.findByIdAndUpdate(id, {
        $set: { isBlocked: !findUser?.isBlocked },
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByUsername(username: string): Promise<User | null | undefined> {
    try {
      const user = await UserModel.findOne(
        { username: username },
        { password: 0 }
      ).lean();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getTotalUsersAnalytics(): Promise<any> {
    try {
     const result = await UserModel.aggregate([
  {
    $facet: {
      totalUsers: [
        { $match: {} },
        { $count: "totalUsers" },
      ],
      blockedUsers: [
        { $match: { isBlocked: true } },
        { $count: "blockedUsers" },
      ],
      premiumUsers: [
        { $match: { "profile.isPremium": true } },
        { $count: "premiumUsers" },
      ],
      ageGroups: [
        {
          $bucket: {
            groupBy: "$profile.age",
            boundaries: [15, 25, 35], // Adjust boundaries as needed
            default: "35+",
            output: {
              count: { $sum: 1 },
            },
          },
        },
        {
          $group: {
            _id: null,
           "<15": { $sum: { $cond: [{ $lt: ["$_id", 15] }, "$count", 0] } },
            "15-25": { $sum: { $cond: [{ $and: [{ $gte: ["$_id", 15] }, { $lte: ["$_id", 25] }] }, "$count", 0] } },
            "26-35": { $sum: { $cond: [{ $and: [{ $gte: ["$_id", 26] }, { $lte: ["$_id", 35] }] }, "$count", 0] } },
            "35+": { $sum: { $cond: [{ $gt: ["$_id", 35] }, "$count", 0] } },
          },
        },
        {
          $project: {
            _id: 0,
            "<15": 1,
            "15-25": 1,
            "26-35": 1,
            "35+": 1,
          },
        },
      ],
    },
  },
  {
    $project: {
      totalUsers: { $arrayElemAt: ["$totalUsers.totalUsers", 0] || 0 },
      blockedUsers: { $arrayElemAt: ["$blockedUsers.blockedUsers", 0] || 0 },
      premiumUsers: { $arrayElemAt: ["$premiumUsers.premiumUsers", 0] || 0 },
      ageGroups: { $arrayElemAt: ["$ageGroups", 0] || {} },
    },
  },
  {
    $addFields: {
      totalUsers: { $ifNull: ["$totalUsers", 0] },
      blockedUsers: { $ifNull: ["$blockedUsers", 0] },
      premiumUsers: { $ifNull: ["$premiumUsers", 0] },
    },
  },
]);


    
      return result[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const repo = new UserReposotory();

repo.getTotalUsersAnalytics();

export default UserReposotory;
