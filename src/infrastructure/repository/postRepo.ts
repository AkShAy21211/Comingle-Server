import Posts from "../../domain/entities/post";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import postModel from "../database/postModel";
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

  async getAllposts(page:number): Promise<Posts[] | null | undefined> {
    
    try {

      const perPage =2;
      
      const posts = (await postModel.find({isHidden:false},undefined).
      lean().
      limit(perPage).
      skip(page*perPage).
      populate('userId','name profile.image _id').
      sort({createdAt:-1}));

      return posts;
    } catch (error) {
      
      console.log(error);
      
    }
  }
}

export default PostReposotory;
