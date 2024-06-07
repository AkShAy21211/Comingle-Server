import Posts from "../../entities/post";

interface IPostUseCase{


    createNewPost(userID:string,images:Express.Multer.File[],text:string):Promise<any>;
    getAllPosts(page:number):Promise<any>;
}

export default IPostUseCase;