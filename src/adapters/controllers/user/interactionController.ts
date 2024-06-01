import { Request,Response } from "express";
import InteractionUseCase from "../../../userCase/user/interactionUseCase";

class InteractionController {


    constructor(private _interactionUseCase:InteractionUseCase){}


    async followUser(req:Request,res:Response):Promise<void>{

        try {
            
            const followRequest = await this._interactionUseCase.followUser(req.user?.id as string,req.body.recipient);
            res.json(followRequest)
            
        } catch (error) {
            console.log(error);
            
        }
    }
}

export default InteractionController;