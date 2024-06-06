import Posts from "../../domain/entities/post";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IPostUseCase from "../../domain/interfaces/user/IPostUseCase";
import { uploadMultiple } from "../../infrastructure/utils/uploadToCloudnary";

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
            return uploadMultiple(file.path, 'posts');
          })
        );

      const imageUrl:string[] = results.map(image=>image.url);  

      const newPost = await this._postRepo.createPost(userID, imageUrl, text);

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
}

export default PostUseCase;
