import IDashboardUseCase from "../../domain/interfaces/admin/IDashboardUseCase";
import IEngagementRepo from "../../domain/interfaces/admin/IEngagementRepo";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import IUserReop from "../../domain/interfaces/user/IUserRepo";

class DashboardUseCase implements IDashboardUseCase {
  constructor(
    private _postRepo: IPostRepo,
    private _userRepo: IUserReop,
    private _engagementRepo: IEngagementRepo
  ) {}

  async getAnatytics(): Promise<any> {
    try {
      const users = await this._userRepo.getTotalUsersAnalytics();
      const posts = await this._postRepo.getTotalPostsAnalytics();
      const engagements = await this._engagementRepo.getEngagement();

      console.log(users);

      return {
        user: users,
        post: posts,
        engagement: engagements,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default DashboardUseCase;
