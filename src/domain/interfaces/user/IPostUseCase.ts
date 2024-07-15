import Posts from "../../entities/post";

interface IPostUseCase{


    createNewPost(userID:string,images:Express.Multer.File[],text:string,schedule:string):Promise<any>;
    getAllPosts(page:number,isAdminRequest:boolean):Promise<any>;
    likePost(postId:string,userId:string,authorId:string):Promise<any>
    commentPost(postId:string,userId:string,comment:string,authorId:string):Promise<any>;
    unLikePost(postId:string,userId:string):Promise<any>;
    reportPost(postId:string,reason:string):Promise<any>;
    deltePost(postId:string):Promise<any>;
    deleteComment(commentId:string,postId:string):Promise<any>;
    editComment(commentId:string,postId:string,newComment:string):Promise<any>;
    editPost(postId: string,text:string): Promise<any>;
    getSinglePost(postId:string):Promise<any>;
    fetchSchedules():Promise<any>
 

}

export default IPostUseCase;