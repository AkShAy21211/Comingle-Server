import Comment from "../../entities/comment";
import Like from "../../entities/like";
import Posts from "../../entities/post";

interface IPostRepo{


    createPost(userId:string,content:{url:string,type:string}[],text:string,schedule:Date|undefined):Promise<Posts|null|undefined>;
    getAllposts(page:number,isAdminRequest:boolean):Promise<Posts[]|any|null|undefined>
    likePost(postId:string,userId:string):Promise<Like|null|undefined>
    commentPost(postId:string,userId:string,comment:string):Promise<Comment|null|undefined>;
    findPostLikes(id:string):Promise<Like|null|undefined>;
    unLikePost(postId:string,userId:string):Promise<Like|null|undefined>;
    hideUnhidePost(postId:string):Promise<Posts|null|undefined>;
    getLikes(postId:string):Promise<Like|null|undefined>;
    getComments(postId:string):Promise<Comment|null|undefined>;
    getTotalPostsAnalytics():Promise<any>;
    findPostsByUser(userId:string):Promise<any|null|undefined>;
    deletePost(postId:string):Promise<any>;
    deleteComment(postId:string,commentId:string):Promise<any>;
    editComment(commentId:string,postId:string,newComment:string):Promise<any>;
    editPost(postId:string,text:string):Promise<Posts|null|undefined>;
    getSinglePost(postId:string):Promise<any>|null|undefined;
    fetchSchedules():Promise<Posts[]|null|undefined>;
    updateSchedule(currentDate:Date,postId:string):Promise<void>;

    
}

export default IPostRepo