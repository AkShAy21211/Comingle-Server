import IPostUseCase from "../../domain/interfaces/admin/IPostUseCase";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IReportRepo from "../../domain/interfaces/user/IReportReopo";
import { log } from "console";

class PostUseCase implements IPostUseCase {
  constructor(private _postRepo: IPostRepo, private _reportRepo: IReportRepo) {}

  async getAllPostsDetails(
    page: number,
    isAdminRequest: boolean
  ): Promise<any> {
    try {
      const posts = await this._postRepo.getAllposts(page, isAdminRequest);
      const reports = await this._reportRepo.getReports();

      if (posts) {
        return {
          status: true,
          posts: posts,
          retports: reports,
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

  async hideOrUnHidePost(postId: string): Promise<any> {
    try {
      const status = await this._postRepo.hideUnhidePost(postId);

      if (status) {
        return {
          status: true,
          message: status.isHidden ? "post hided" : "post unhided",
        };
      }
      return {
        status: false,
        message: "something went wrong try again",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async dismissPostReport(postId: string): Promise<any> {
    try {
      const result = await this._reportRepo.deleteReport(postId);

      if (result) {
        return {
          status: true,
          message: "Report deleted",
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

  async getPostReactioin(postId: string): Promise<any> {
    try {
      const postLikes = await this._postRepo.getLikes(postId);
      const postComments = await this._postRepo.getComments(postId);

        return {
          status: true,
          likes: postLikes || null,
          comments: postComments || null,
        };
     
    } catch (error) {
      console.log(error);
    }
  }
}

export default PostUseCase;
