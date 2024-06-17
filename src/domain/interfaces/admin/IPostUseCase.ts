interface IPostUseCase{

    getAllPostsDetails(page:number,isAdminRequest:boolean):Promise<any>;
    hideOrUnHidePost(postId:string):Promise<any>;
    dismissPostReport(reportId:string):Promise<any>
    getPostReactioin(postId:string):Promise<any>

}

export default IPostUseCase;