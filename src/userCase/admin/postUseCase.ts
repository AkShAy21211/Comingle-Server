import IPostUseCase from "../../domain/interfaces/admin/IPostUseCase";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IReportRepo from "../../domain/interfaces/user/IReportReopo";
import { log } from 'console';

class PostUseCase implements IPostUseCase {
  constructor(private _postRepo: IPostRepo,private _reportRepo:IReportRepo) {}

  async getAllPostsDetails(page: number,isAdminRequest:boolean): Promise<any> {
    try {
      const posts = await this._postRepo.getAllposts(page,isAdminRequest);
      const reports = await this._reportRepo.getReports();
      
      if (posts) {
        return {
          status: true,
          posts: posts,
          retports:reports
        };
      } else {
        return {
          status: false,
          message: "Error fetching posts",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async hideOrUnHidePost(postId:string):Promise<any>{

    try {

     const status =  await this._postRepo.hideUnhidePost(postId);
      
     if(status){

      return {

        status:true,
        message:status.isHidden?'post hided':'post unhided'
      }
    }
       return {

        status:false,
        message:'something went wrong try again'
      }

     
    } catch (error) {
      
      console.log(error);
      
    }
  }
}

export default PostUseCase;
