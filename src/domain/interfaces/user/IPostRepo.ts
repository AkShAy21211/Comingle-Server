import Like from "../../entities/like";
import Posts from "../../entities/post";

interface IPostRepo{


    createPost(userId:string,images:string[],text:string):Promise<Posts|null|undefined>;
    getAllposts(page:number):Promise<Posts[]|null|undefined>
    likePost(postId:string,userId:string):Promise<Like|null|undefined>
}

export default IPostRepo