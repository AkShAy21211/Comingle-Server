import { Request, Response } from "express";
import PostUseCase from "../../../userCase/admin/postUseCase";
import { log } from "console";

class PostController {
  constructor(private _postUseCase: PostUseCase) {}

  async getAlllPosts(req: Request, res: Response): Promise<void> {
    try {
      const { page } = req.params;
      const isAdminRequest = req.baseUrl === "/admin" ? true : false;

      const posts = await this._postUseCase.getAllPostsDetails(
        parseInt(page),
        isAdminRequest
      );
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });

      console.log(error);
    }
  }

  async hideOrUnhidePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const response = await this._postUseCase.hideOrUnHidePost(postId);

      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }

  async dismissRepotPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;

      const response = await this._postUseCase.dismissPostReport(postId);

      console.log(response);

      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getPostReaction(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
   
      const response = await this._postUseCase.getPostReactioin(postId);
      if (response.status) {
        res.status(200).json(response);
      } 
    } catch (error) {
      res.status(500).json({message:"Internal server error"})
      console.log(error);
      
    }
  }
}

export default PostController;
