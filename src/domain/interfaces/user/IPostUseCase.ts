import Posts from "../../entities/post";

interface IPostUseCase{


    createNewPost(userID:string,images:Express.Multer.File[],text:string):Promise<any>;
    getAllPosts(page:number,isAdminRequest:boolean):Promise<any>;
    likePost(postId:string,userId:string,authorId:string):Promise<any>
    commentPost(postId:string,userId:string,comment:string,):Promise<any>;
    unLikePost(postId:string,userId:string):Promise<any>;
    reportPost(postId:string,reason:string):Promise<any>;

}

export default IPostUseCase;