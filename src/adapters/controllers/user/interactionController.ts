import { Request, Response } from "express";
import InteractionUseCase from "../../../userCase/user/interactionUseCase";
import UserReposotory from "../../../infrastructure/repository/userRepo";
import IUserReop from "../../../domain/interfaces/user/IUserRepo";

class InteractionController {
  constructor(
    private _interactionUseCase: InteractionUseCase,
  ) {}

  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const requester = req.user?.id;
      const { recipientId } = req.body;
      const followRequest = await this._interactionUseCase.followUser(
        requester as string,
        recipientId
      );


      await this._interactionUseCase.createNotificatioin(
        req.body.recipientId as string,
        followRequest.type,
        followRequest.content,
        followRequest.follow._id
      );

      if (followRequest.status) {
        res.status(200).json(followRequest);
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
}

export default InteractionController;
