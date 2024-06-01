import IFollowRepo from "../../domain/interfaces/user/IFollowRepo";
import IInteractionUseCase from "../../domain/interfaces/user/IInteractionUseCase";
import IUserReop from "../../domain/interfaces/user/IUserRepo";

class InteractionUseCase implements IInteractionUseCase {
  constructor(private _reposotory: IFollowRepo, private _userRepo: IUserReop) {}

  async followUser(requester: string, recipient: string): Promise<any> {
    try {
      const followRequest = await this._reposotory.createFollowRequest(
        requester,
        recipient
      );

      const updatedFollowerAndFollower = await this._reposotory.getFollowerAndFollowing(requester);

      if (followRequest) {
        return {
          status: true,
          follow:updatedFollowerAndFollower
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsers(id: string): Promise<any> {
    try {
      const users = await this._userRepo.getAllUsers();
      const follower = await this._reposotory.getFollowerAndFollowing(id);
      if (users) {
        return {
          status: true,
          users: users,
          followers: follower,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default InteractionUseCase;
