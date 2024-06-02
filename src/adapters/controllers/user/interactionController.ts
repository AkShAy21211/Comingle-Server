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

  async getAllNotifications(req:Request,res:Response):Promise<void>{

    try {

      const notificationsResponse = await this._interactionUseCase.getAllNotifications(req.user?.id as string);

      if(notificationsResponse.status){
        res.status(200).json(notificationsResponse);
      }      
      
    } catch (error) {
     
      res.status(500).json({message:"Internal server error"});
    }
  }
}

export default InteractionController;
