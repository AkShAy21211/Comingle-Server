import UserUseCase from "../../../userCase/admin/userUseCase";
import { Response, Request } from "express";
class UserController {
  constructor(private _userUseCase: UserUseCase) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const userResponse = await this._userUseCase.getAllUsers();

      if (userResponse) {
        res.status(200).json(userResponse);
      }
    } catch (error) {
      res.status(500).json({ messsage: "Internal server error" });
      console.log(error);
    }
  }

  async blockAndUnblaockUser(req:Request,res:Response):Promise<void>{

    try {

      const {userId} = req.params;

      const userResponse = await this._userUseCase.blockAndUnblockUser(userId);

      if(userResponse.status){

        res.status(200).json(userResponse)
      }else{
        res.status(400).json(userResponse)

      }
      
    } catch (error) {
      
    }
  }
}

export default UserController;
