import Posts from "../../entities/post";

interface IPostRepo{


    createPost(userId:string,images:string[],text:string):Promise<Posts|null|undefined>;
}

export default IPostRepo