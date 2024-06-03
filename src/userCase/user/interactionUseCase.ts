import Follow from "../../domain/entities/follow";
import IFollowRepo from "../../domain/interfaces/user/IFollowRepo";
import IInteractionUseCase from "../../domain/interfaces/user/IInteractionUseCase";
import INotificationRepo from "../../domain/interfaces/user/INotificationRepo";
import IUserReop from "../../domain/interfaces/user/IUserRepo";
import NotificationDetails from "../../domain/enum/notification";

class InteractionUseCase implements IInteractionUseCase {
  constructor(
    private _reposotory: IFollowRepo,
    private _userRepo: IUserReop,
    private _notificationRepo: INotificationRepo
  ) {}

  async followUser(requester: string, recipient: string): Promise<any> {
    try {
     

      const followRequest = await this._reposotory.createFollowRequest(
        requester,
        recipient
      );

  

      if (followRequest) {
        return {
          status: true,
          follow: followRequest,
          type: NotificationDetails.followRequest.displayName,
          content: NotificationDetails.followRequest.content,
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
  async createNotificatiioin(
    id: string,
    type: string,
    content: string
  ): Promise<void> {
    try {
      await this._notificationRepo.createNotification(id, type, content);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllNotifications(id: string): Promise<any> {
    try {
      const notifications = await this._notificationRepo.getNotifications(id);
      const followerRequest = await this._reposotory.getFollowedUser(id);
      return {
        status: true,
        notifications: notifications,
        followers: followerRequest,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getFollowRequestStatus(
    requesterId:string,
    recipitent: string
  ): Promise<any> {
    try {
      console.log('+++++++++++++++++++++++++',requesterId,recipitent);
      
      const folloeStatus = await this._reposotory.getStatus(
        requesterId,
        recipitent
      );

      const followedByMe = await this._reposotory.getFollowingUser(requesterId);

      const followedByOther = await this._reposotory.getFollowedUser(requesterId);

      console.log('folow bu other to me',followedByOther);

      console.log('follow request by me',followedByMe);

      
      if (folloeStatus || followedByMe || followedByOther) {
        return {
          status: true,
          followStatus: folloeStatus,
          followedByMe:followedByMe,
          followedByOther:followedByOther
        };
      }

      return {
        status: false,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async acceptFollowRequest(
    followId: string,

  ): Promise<any> {
    try {
      const followStatus = await this._reposotory.updateFollowStatus(
      followId,
      'Accepted'
      );

      if (followStatus) {
        return {
          status: true,
          follow: followStatus,
          type:NotificationDetails.followAccept.displayName,
          content:NotificationDetails.followAccept.content
        };
      }

      return {
        stattus: false,
      };
    } catch (error) {
      console.log(error);
      
    }
  }
}

export default InteractionUseCase;
