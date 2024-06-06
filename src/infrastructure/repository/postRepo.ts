import Posts from "../../domain/entities/post";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import PostModel from "../database/postModel";

class PostReposotory implements IPostRepo {
  async createPost(
    userId: string,
    images: string[],
    text: string
  ): Promise<Posts | null | undefined> {
    try {
      const newPost = new PostModel({
        userId: userId,
        image: images,
        description: text,
      });

      await newPost.save();

      return newPost.toObject();
    } catch (error) {
      console.log(error);
    }
  }
}

export default PostReposotory;
