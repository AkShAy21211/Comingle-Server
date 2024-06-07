import Posts from "../../domain/entities/post";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IPostUseCase from "../../domain/interfaces/user/IPostUseCase";
import { uploadMultiple } from "../../infrastructure/utils/uploadToCloudnary";
import { log } from 'console';

class PostUseCase implements IPostUseCase {
  constructor(private _postRepo: IPostRepo) {}

  async createNewPost(
    userID: string,
    images: Express.Multer.File[],
    text: string
  ): Promise<any> {
    try {
      const results = await Promise.all(
        images.map((file) => {
          return uploadMultiple(file.path, "posts");
        })
      );

      const imageUrl: string[] = results.map((image) => image.url);

      const newPost = await this._postRepo.createPost(
        userID,
        imageUrl || [""],
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

  async getAllPosts(page: number): Promise<any> {
    try {
      const allPosts = await this._postRepo.getAllposts(page);

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

  async likePost(postId: string, userId: string): Promise<any> {
    try {

     console.log(postId,userId);
     
      
      const likePost = await this._postRepo.likePost(postId, userId);

      if (likePost) {
        return {
          status: true,
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
}

export default PostUseCase;
