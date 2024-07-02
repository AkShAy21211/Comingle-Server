import { Request, Response } from "express";
import IPostUseCase from "../../../domain/interfaces/user/IPostUseCase";

class PostController {
  constructor(private _postUserCase: IPostUseCase) {}

  async createNewPost(req: Request, res: Response): Promise<void> {
    try {
      console.log("called");

      const userId = req.user?.id as string;
      const text = req.body.text;
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];

      const newPostResponse = await this._postUserCase.createNewPost(
        userId,
        files,
        text
      );

      if (newPostResponse.status) {
        res.status(201).json(newPostResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 0;
      const isAdminRequest = req.baseUrl === "/admin" ? true : false;

      const postResponse = await this._postUserCase.getAllPosts(
        page,
        isAdminRequest
      );

      if (postResponse.status) {
        res.status(200).json(postResponse);
      } else {
        res.json(postResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async likePost(req: Request, res: Response): Promise<void> {
    try {
      const { userId, postId, authorId } = req.params;

      const likeResponse = await this._postUserCase.likePost(
        postId,
        userId,
        authorId
      );
      if (likeResponse) {
        res.status(201).json(likeResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async unLikePost(req: Request, res: Response): Promise<void> {
    try {
      const { userId, postId } = req.params;

      const likeResponse = await this._postUserCase.unLikePost(postId, userId);
      console.log(likeResponse);

      if (likeResponse) {
        res.status(200).json(likeResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async commentPost(req: Request, res: Response): Promise<void> {
    try {
      const { userId, postId } = req.params;
      const { comment } = req.body;
      const commentResponse = await this._postUserCase.commentPost(
        postId,
        userId,
        comment
      );
      if (commentResponse) {
        res.status(201).json(commentResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async reportPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId, reason } = req.body;
      const report = await this._postUserCase.reportPost(postId, reason);

      if (report.status) {
        res.status(201).json(report);
      } else {
        res.status(400).json(report);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;

      const deleteResponse = await this._postUserCase.deltePost(postId);

      if (deleteResponse.status) {
        res.status(200).json(deleteResponse);
      } else {
        res.json(deleteResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId, postId } = req.params;
      console.log(commentId, postId);

      const deleteResponse = await this._postUserCase.deleteComment(
        commentId,
        postId
      );

      if (deleteResponse.status) {
        res.status(200).json(deleteResponse);
      } else {
        res.status(400).json(deleteResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async editPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId, text } = req.body;

      const editPostResponse = await this._postUserCase.editPost(postId, text);

      if (editPostResponse.status) {
        res.status(200).json(editPostResponse);
      } else {
        res.status(400).json(editPostResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async editComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId, postId, newComment } = req.body;
      console.log("fdsfdsfdsfdsfdsfsdfdsf", commentId, postId, newComment);

      const deleteResponse = await this._postUserCase.editComment(
        commentId,
        postId,
        newComment
      );

      if (deleteResponse.status) {
        res.status(200).json(deleteResponse);
      } else {
        res.status(400).json(deleteResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getSinglePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const postResponse = await this._postUserCase.getSinglePost(postId);

      if (postResponse.status) {
        res.status(200).json(postResponse);
      } else {
        res.status(400).json(postResponse);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default PostController;
