import { use } from "passport";
import { User } from "../../../../frontend/src/Interface/interface";
import IUsersUseCase from "../../domain/interfaces/admin/IUsersUsecase";
import IUserReop from "../../domain/interfaces/user/IUserRepo";

class UserUseCase implements IUsersUseCase {
  constructor(private _userRepo: IUserReop) {}
  async getAllUsers(): Promise<User[] | null | undefined> {
    try {
      const user = await this._userRepo.fetchAllUsers();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async blockAndUnblockUser(id: string): Promise<any> {
    try {
      const user = await this._userRepo.blockOrUnblockUser(id);

      if (user) {
        return {
          status: true,
          message:`${user.isBlocked?'Blocked user':'Unblocker user'}`,
          user: user,
        };
      }

      return {
        status: false,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserUseCase;
