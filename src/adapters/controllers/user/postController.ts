import { Request, Response } from "express";
import IPostUseCase from "../../../domain/interfaces/user/IPostUseCase";

class PostController {
  constructor(private _postUserCase: IPostUseCase) {}

  async createNewPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const text = req.body.text;
      const imagePath: Express.Multer.File[] = req.files as Express.Multer.File[];


        const newPostResponse = await this._postUserCase.createNewPost(
          userId,
          imagePath,
          text
        );

        if (newPostResponse.status) {
          res.status(201).json(newPostResponse);
        }
      
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default PostController;
