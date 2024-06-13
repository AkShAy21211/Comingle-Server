interface IPostUseCase{

    getAllPostsDetails(page:number,isAdminRequest:boolean):Promise<any>;
    hideOrUnHidePost(postId:string):Promise<any>;

}

export default IPostUseCase;