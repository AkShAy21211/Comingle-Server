import IFollowRepo from "../../domain/interfaces/user/IFollowRepo";
import IInteractionUseCase from "../../domain/interfaces/user/IInteractionUseCase";
import INotificationRepo from "../../domain/interfaces/user/INotificationRepo";
import IUserReop from "../../domain/interfaces/user/IUserRepo";

class InteractionUseCase implements IInteractionUseCase {
  constructor(private _reposotory: IFollowRepo, private _userRepo: IUserReop,private _notificationRepo:INotificationRepo) {}

  async followUser(requester: string, recipient: string): Promise<any> {
    try {


      const existingRequest = await this._reposotory.findFollowBeforeCreatingNewOne(requester,recipient);

      
      const followRequest = await this._reposotory.createFollowRequest(
        requester,
        recipient
      );

     

      const updatedFollowerAndFollower = await this._reposotory.getFollowingUser(requester);

      if (followRequest) {
        return {
          status: true,
          follow:updatedFollowerAndFollower,
          type:'Follow',
          content:'has started following you',

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
      const users = await this._userRepo.getAllUsers(id);
      const follower = await this._reposotory.getFollowingUser(id);
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
  async createNotificatiioin(id: string, type: string, content: string): Promise<void> {
    
    try {


     await this._notificationRepo.createNotification(id,type,content)
      

    } catch (error) {

      console.log(error);
      
      
    }
  }

  async getAllNotifications(id: string): Promise<any> {
    try {
      
      const notifications = await this._notificationRepo.getNotifications(id);
      const followerRequest = await this._reposotory.getFollowedUser(id);
      return {
        status:true,
        notifications:notifications,
        followers:followerRequest
      };

    } catch (error) {
      
      console.log(error);
      
    }
  }
}

export default InteractionUseCase;
