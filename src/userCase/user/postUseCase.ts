import Posts from "../../domain/entities/post";
import INotificationRepo from "../../domain/interfaces/user/INotificationRepo";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IPostUseCase from "../../domain/interfaces/user/IPostUseCase";
import { uploadPosts } from "../../infrastructure/utils/uploadToCloudnary";
import NotificationDetails from "../../domain/enum/notification";
import notificationModel from "../../infrastructure/database/notificationModel";
import mongoose from "mongoose";
import IReportRepo from "../../domain/interfaces/user/IReportReopo";
class PostUseCase implements IPostUseCase {
  constructor(
    private _postRepo: IPostRepo,
    private _notficationRepo: INotificationRepo,
    private _reportRepo: IReportRepo
  ) {}

  async createNewPost(
    userID: string,
    images: Express.Multer.File[],
    text: string
  ): Promise<any> {
    try {
      const results:{url:string,resource:string}[] = await Promise.all(
        images.map((file) => {
          return uploadPosts(file, "posts");
        })
      );

       let arr:{url:string,type:string}[] = []

      if(results.length===0){
        arr.push({url:results[0].url,type:results[0].resource})
      }else{
        results.forEach((result) => {
          arr.push({ url: result.url, type: result.resource });
        });
      }

      
    
      console.log(arr);
      
      
    
      const newPost = await this._postRepo.createPost(
        userID,
        arr,
        text
      );

      if (newPost) {
        return {
          status: true,
          message: "Post created successfully",
        };
      }

      return {
        status: false,
        message: "Something went wrong",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllPosts(page: number,isAdminRequest:boolean): Promise<any> {
    try {
      const allPosts = await this._postRepo.getAllposts(page,isAdminRequest);

      if (allPosts) {
        return {
          status: true,
          posts: allPosts,
        };
      } else {
        return {
          status: false,
          message: "Error fetching posts",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async likePost(
    postId: string,
    userId: string,
    authorId: string
  ): Promise<any> {
    try {
      const likePost = await this._postRepo.likePost(postId, userId);

      if (likePost) {
        if (authorId !== userId) {
          await this._notficationRepo.createNotification(
            authorId,
            NotificationDetails.like.displayName,
            NotificationDetails.like.content,
            likePost._id
          );
        }

        return {
          status: true,
          likes: likePost,
          message: "like added",
        };
      }

      return {
        status: false,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async unLikePost(postId: string, userId: string): Promise<any> {
    try {
      const unLikePost = await this._postRepo.unLikePost(postId, userId);

      if (unLikePost) {
        return {
          status: true,
          likes: unLikePost,
          message: "like removed",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async commentPost(
    postId: string,
    userId: string,
    comment: string
  ): Promise<any> {
    try {
      const commentPost = await this._postRepo.commentPost(
        postId,
        userId,
        comment
      );

      if (commentPost) {
        console.log("------------------------------", commentPost);

        return {
          status: true,
          comment: commentPost,
          message: "Comment added",
        };
      }

      return {
        status: false,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async reportPost(postId: string, reason: string): Promise<any> {
    try {
      const repost = await this._reportRepo.createReport(postId, reason);

      if (repost) {
        return {
          status: true,
          message: "Report sent",
        };
      } else {
        return {
          status: false,
          message: "Failed to report",
        };
      }
    } catch (error) {

      console.log(error);
      
    }
  }
}

export default PostUseCase;
