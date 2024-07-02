import User from "../../domain/entities/user";
import IUsersUseCase from "../../domain/interfaces/admin/IUsersUsecase";
import IUserReop from "../../domain/interfaces/user/IUserRepo";

class UserUseCase implements IUsersUseCase {
  constructor(private _userRepo: IUserReop) {}

  async getAllUsers(): Promise<User[] | null | undefined> {
    try {
      const users = await this._userRepo.fetchAllUsers();

      return users;
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
          message: `${user.isBlocked ? "Blocked user" : "Unblocker user"}`,
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
