import { Request, Response } from "express";
import InteractionUseCase from "../../../userCase/user/interactionUseCase";
import UserReposotory from "../../../infrastructure/repository/userRepo";
import IUserReop from "../../../domain/interfaces/user/IUserRepo";
import { User } from "../../../../../frontend/src/Interface/interface";

class InteractionController {
  constructor(private _interactionUseCase: InteractionUseCase) {}

  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const requester = req.user?.id;
      const { recipient } = req.body;

      const followRequest = await this._interactionUseCase.followUser(
        requester as string,
        recipient
      );

      if (followRequest.status) {
        await this._interactionUseCase.createNotificatioin(
          req.body.recipient as string,
          followRequest.type,
          followRequest.content,
          followRequest.follow._id
        );
        res.status(200).json(followRequest);
      } else {
        res.status(400).json(followRequest);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const usersResponse = await this._interactionUseCase.getAllUsers(
        req.user?.id as string
      );

      if (usersResponse.status) {
        res.status(200).json(usersResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const notificationsResponse =
        await this._interactionUseCase.getAllNotifications(
          req.user?.id as string
        );

      if (notificationsResponse.status) {
        res.status(200).json(notificationsResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getFollowRequestStatus(req: Request, res: Response): Promise<void> {
    try {
      const { requesterId, recipietnetId } = req.params;

      const followResponse =
        await this._interactionUseCase.getFollowRequestStatus(
          requesterId,
          recipietnetId
        );

      if (followResponse.status) {
        res.status(200).json(followResponse);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  }

  async acceptFollowRequest(req: Request, res: Response): Promise<void> {
    try {
      const requesterId = req.user?.id;
      const { followId, notificationId } = req.params;

      const acceptFollowResponse =
        await this._interactionUseCase.acceptFollowRequest(
          followId,
          notificationId
        );

      await this._interactionUseCase.createNotificatioin(
        acceptFollowResponse.follow.requester,
        acceptFollowResponse.type,
        acceptFollowResponse.content,
        acceptFollowResponse.follow._id
      );

      if (acceptFollowResponse.status) {
        res.status(200).json(acceptFollowResponse);
      } else {
        res.status(400).json(acceptFollowResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }

  async getFriends(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const userFriends = await this._interactionUseCase.findFriends(userId);

      if (userFriends) {
        res.status(200).json(userFriends);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }
  async getFriendsSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const friendsSuggestions =
        await this._interactionUseCase.findFriendsSuggestions(
          req.user?.id as string
        );

      if (friendsSuggestions.status) {
        res.status(200).json(friendsSuggestions);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
      console.log(error);
    }
  }
  async removeFollowing(req: Request, res: Response): Promise<void> {
    try {
      const id = req?.user?.id;
      const { following } = req.body;

      const unfollowResponse = await this._interactionUseCase.removeFollowing(
        id as string,
        following
      );
      if (unfollowResponse.status) {
        res.status(200).json(unfollowResponse);
      } else {
        res.status(400).json(unfollowResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default InteractionController;
