import Follow from "../../domain/entities/follow";
import IFollowRepo from "../../domain/interfaces/user/IFollowRepo";
import followModel from "../database/folllowModel";

class FollowReposotory implements IFollowRepo {
    
  async createFollowRequest(
    requester: string,
    recipient: string
  ): Promise<Follow | null | undefined> {
    try {
      const follow = new followModel({
        requester: requester,
        recipient: recipient,
      });

      await follow.save();
      return follow ? follow.toObject() : null;
    } catch (error) {
      console.log(error);
    }
  }
}

export default FollowReposotory;
