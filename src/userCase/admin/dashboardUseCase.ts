import IDashboardUseCase from "../../domain/interfaces/admin/IDashboardUseCase";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IUserReop from "../../domain/interfaces/user/IUserRepo";

class DashboardUseCase implements IDashboardUseCase{

    constructor(private _postRepo:IPostRepo,private _userRepo:IUserReop){}

    async getAnatytics(): Promise<any> {
        
        try {
            
            const users = await this._userRepo.getTotalUsersAnalytics()
            const posts = await this._postRepo.getTotalPostsAnalytics();

            console.log(users);
            
            return {

                user:users,
                post:posts
            }
            
        } catch (error) {
            
            console.log(error);
            
        }
    }




}

export default DashboardUseCase