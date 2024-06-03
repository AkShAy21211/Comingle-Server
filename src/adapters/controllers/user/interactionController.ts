import { Request, Response } from "express";
import InteractionUseCase from "../../../userCase/user/interactionUseCase";

class InteractionController {
  constructor(private _interactionUseCase: InteractionUseCase) {}

  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const followRequest = await this._interactionUseCase.followUser(
        req.user?.id as string,
        req.body.recipientId
      );

      await this._interactionUseCase.createNotificatiioin(
        req.body.recipientId as string,
        followRequest.type,
        followRequest.content
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
      const { followId } = req.params;

      const acceptFollowResponse =
        await this._interactionUseCase.acceptFollowRequest(followId);

      await this._interactionUseCase.createNotificatiioin(
        acceptFollowResponse.recipient,
        acceptFollowResponse.type,
        acceptFollowResponse.content
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
