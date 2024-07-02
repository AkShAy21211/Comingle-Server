import Follow from "../../domain/entities/follow";
import IFollowRepo from "../../domain/interfaces/user/IFollowRepo";
import IInteractionUseCase from "../../domain/interfaces/user/IInteractionUseCase";
import INotificationRepo from "../../domain/interfaces/user/INotificationRepo";
import IUserReop from "../../domain/interfaces/user/IUserRepo";
import NotificationDetails from "../../domain/enum/notification";
import User from "../../domain/entities/user";
import IEngagementRepo from "../../domain/interfaces/admin/IEngagementRepo";

class InteractionUseCase implements IInteractionUseCase {
  constructor(
    private _reposotory: IFollowRepo,
    private _userRepo: IUserReop,
    private _notificationRepo: INotificationRepo,
    private _followRepo: IFollowRepo,
    private _engagementRepo: IEngagementRepo
  ) {}

  async followUser(requester: string, recipient: string): Promise<any> {
    try {
      const userToFind = {
        googleId: "",
        _id: requester,
      };
      const user = await this._userRepo.findUserById(userToFind);
      const isPremiumUser = user?.profile.isPremium;
      const totalFollowRequesOfTheDay =
        await this._followRepo.getFollowRequestByuser(user?._id as string);

      if (
        isPremiumUser &&
        totalFollowRequesOfTheDay &&
        totalFollowRequesOfTheDay?.length > 200
      ) {
        return {
          status: false,
          message: "You have reached follow request limit of the day",
        };
      } else {
        if (
          totalFollowRequesOfTheDay &&
          totalFollowRequesOfTheDay.length > 50
        ) {
          return {
            status: false,
            message: "You have reached follow request limit of the day",
          };
        }
      }

      const followRequest = await this._reposotory.createFollowRequest(
        requester,
        recipient
      );

      const followingId = followRequest?.recipient || "";

      await this._userRepo.addFollowings(requester, followingId as string);
      await this._userRepo.addFollowers(recipient, requester);
      const existiingEngagement =
        await this._engagementRepo.findEngagementOfTheDay();
      if (existiingEngagement) {
        await this._engagementRepo.updateEngagement("followConut");
      } else {
        await this._engagementRepo.createEngagements({
          type: "followConut",
          count: 1,
        });
      }

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
  async createNotificatioin(
    id: string,
    type: string,
    content: string,
    sourceId: string
  ): Promise<void> {
    try {
      await this._notificationRepo.createNotification(
        id,
        type,
        content,
        sourceId
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getAllNotifications(id: string): Promise<any> {
    try {
      const notifications = await this._notificationRepo.getNotifications(id);

      if (notifications) {
        for (let noti of notifications) {
          if (noti.type === "Follow") {
            await noti.populate("sourceId.requester", "name _id profile.image");
            await noti.populate("sourceId.recipient", "name _id profile.image");
          } else if (noti.type === "Like") {
            await noti.populate("sourceId.userId", "name _id profile.image");
          }
        }
      }

      return {
        status: true,
        notifications: notifications,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getFollowRequestStatus(
    requesterId: string,
    recipitent: string
  ): Promise<any> {
    try {
      const folloeStatus = await this._reposotory.getStatus(
        requesterId,
        recipitent
      );

      const followedByMe = await this._reposotory.getFollowingUser(requesterId);

      const followedByOther = await this._reposotory.getFollowedUser(
        requesterId
      );

      if (folloeStatus || followedByMe || followedByOther) {
        return {
          status: true,
          followStatus: folloeStatus,
          followedByMe: followedByMe,
          followedByOther: followedByOther,
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
    notificationId: string
  ): Promise<any> {
    try {
      const followStatus = await this._reposotory.updateFollowStatus(
        followId,
        "Accepted"
      );

      // await this._notificationRepo.deleteNotification(notificationId);
      const requester = followStatus?.requester || "";
      const recipitent = followStatus?.recipient || "";

      console.log(requester);

      console.log(recipitent);

      await this._userRepo.addFollowings(
        requester as string,
        recipitent as string
      );
      await this._userRepo.addFollowers(
        requester as string,
        recipitent as string
      );
      const existiingEngagement =
        await this._engagementRepo.findEngagementOfTheDay();
      if (existiingEngagement) {
        await this._engagementRepo.updateEngagement("followConut");
      } else {
        await this._engagementRepo.createEngagements({
          type: "followConut",
          count: 1,
        });
      }
      if (followStatus) {
        return {
          status: true,
          follow: followStatus,
          type: NotificationDetails.followAccept.displayName,
          content: NotificationDetails.followAccept.content,
        };
      }

      return {
        stattus: false,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findFriends(userId: string): Promise<any> {
    try {
      const friends = await this._userRepo.findFriends(userId);

      return friends;
    } catch (error) {
      console.log(error);
    }
  }

  async findFriendsSuggestions(currentUser: string): Promise<any> {
    try {
      const user = await this._userRepo.findUserById({ _id: currentUser });

      if (!user || !user.profile?.following || !user.profile?.followers) {
        return { status: false };
      }

      const following = user.profile.following;
      const followers = user.profile.followers;
      const suggestions = new Set();

      for (const f of following) {
        const friends = await this._userRepo.findUserById({ _id: f });

        if (friends && friends.profile?.following) {
          for (const fof of friends.profile.following) {
            if (
              fof.toString() !== currentUser &&
              !followers.toString().includes(fof.toString()) &&
              !following.toString().includes(fof.toString())
            ) {
              const suggestedFriend = await this._userRepo.findUserById({
                _id: fof,
              });

              suggestions.add(suggestedFriend);
            }
          }
        }
      }

      
      return {
        status: true,
        suggestions: Array.from(suggestions),
      };
    } catch (error) {
      console.log(error);
    }
  }
  async removeFollowing(id: string, followingId: string): Promise<any> {
    try {
      const removeFollowing = await this._userRepo.removeFollowing(
        id,
        followingId
      );

      if (removeFollowing) {
        return {
          status: true,
          message: "Unfollowed",
        };
      }

      return {
        status: false,
        message: "Something went wrong please try again",
      };
    } catch (error) {
      console.log(error);
      
    }
  }
}

export default InteractionUseCase;
