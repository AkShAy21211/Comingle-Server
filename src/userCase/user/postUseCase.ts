import Posts from "../../domain/entities/post";
import INotificationRepo from "../../domain/interfaces/user/INotificationRepo";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IPostUseCase from "../../domain/interfaces/user/IPostUseCase";
import { uploadPosts } from "../../infrastructure/utils/uploadToCloudnary";
import NotificationDetails from "../../domain/enum/notification";
import notificationModel from "../../infrastructure/database/notificationModel";
import mongoose from "mongoose";
import IReportRepo from "../../domain/interfaces/user/IReportReopo";
import IEngagementRepo from "../../domain/interfaces/admin/IEngagementRepo";
class PostUseCase implements IPostUseCase {
  constructor(
    private _postRepo: IPostRepo,
    private _notficationRepo: INotificationRepo,
    private _reportRepo: IReportRepo,
    private _engagementRepo: IEngagementRepo
  ) {}

  async createNewPost(
    userID: string,
    images: Express.Multer.File[],
    text: string
  ): Promise<any> {
    try {
      let results: { url: string; resource: string }[];
      let uploadedFiles: { url: string; type: string }[] = [];

      if (images.length) {
        results = await Promise.all(
          images.map((file) => {
            return uploadPosts(file, "posts");
          })
        );

        if (results.length === 0) {
          uploadedFiles.push({
            url: results[0].url,
            type: results[0].resource,
          });
        } else {
          results.forEach((result) => {
            uploadedFiles.push({ url: result.url, type: result.resource });
          });
        }
      }

      const newPost = await this._postRepo.createPost(
        userID,
        uploadedFiles,
        text
      );

      const existiingEngagement =
        await this._engagementRepo.findEngagementOfTheDay();
      if (existiingEngagement) {
        await this._engagementRepo.updateEngagement("postCount");
      } else {
        await this._engagementRepo.createEngagements({
          type: "postCount",
          count: 1,
        });
      }

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

  async getAllPosts(page: number, isAdminRequest: boolean): Promise<any> {
    try {
      const allPosts = await this._postRepo.getAllposts(page, isAdminRequest);

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
        // if (authorId !== userId) {
        //   await this._notficationRepo.createNotification(
        //     authorId,
        //     NotificationDetails.like.displayName,
        //     NotificationDetails.like.content,
        //     likePost._id
        //   );
        // }
        const existiingEngagement =
          await this._engagementRepo.findEngagementOfTheDay();
        if (existiingEngagement) {
          await this._engagementRepo.updateEngagement("likeConut");
        } else {
          await this._engagementRepo.createEngagements({
            type: "likeConut",
            count: 1,
          });
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
        const existiingEngagement =
          await this._engagementRepo.findEngagementOfTheDay();
        if (existiingEngagement) {
          await this._engagementRepo.updateEngagement("commentCount");
        } else {
          await this._engagementRepo.createEngagements({
            type: "commentCount",
            count: 1,
          });
        }
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

  async deltePost(postId: string): Promise<any> {
    try {
      const deletePost = await this._postRepo.deletePost(postId);

      if (deletePost) {
        return {
          status: true,
          message: "Post deleted",
        };
      }

      return {
        status: true,
        message: "Something went wrong please retry",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async editPost(postId: string, text: string): Promise<any> {
    try {
      const editPost = await this._postRepo.editPost(postId, text);

      if (editPost) {
        return {
          status: true,
          message: "Post edited",
        };
      }

      return {
        status: true,
        message: "Something went wrong please retry",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteComment(commentId: string, postId: string): Promise<any> {
    try {
      const deteComment = await this._postRepo.deleteComment(postId, commentId);

      if (deteComment) {
        return {
          status: true,
          message: "Comment deleted",
        };
      }

      return {
        status: false,
        message: "Something went wrong please try again",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async editComment(
    commentId: string,
    postId: string,
    newComment: string
  ): Promise<any> {
    try {
      const comment = await this._postRepo.editComment(
        commentId,
        postId,
        newComment
      );

      if (comment) {
        return {
          status: true,
          comment,
          message: "Comment edited",
        };
      }

      return {
        status: false,
        message: "Something went wrong please try again",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getSinglePost(postId: string): Promise<any> {
    try {
      const post = await this._postRepo.getSinglePost(postId);

      if (post) {
        return {
          status: true,
          post,
        };
      }

      return {
        status: false,
        message: "Post not found",
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default PostUseCase;
