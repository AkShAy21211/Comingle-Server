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

  async getFollowingUser(id: string): Promise<Follow[] | null | undefined> {
    try {
      const followeres = await followModel
        .find({
          requester: id,

        })
        .lean();
      return followeres;
    } catch (error) {
      console.log(error);
    }
  }
  async getFollowedUser(id: string): Promise<Follow[] | null | undefined> {
    try {
      const followeres = await followModel
        .find({
          recipient: id,

        })
        .lean();

      return followeres;
    } catch (error) {
      console.log(error);
    }
  }

  async getStatus(
    requesterId: string,
    recipitent: string
  ): Promise<string | null | undefined> {
    try {

      const followStatus = await followModel
        .findOne({ requester: requesterId, recipient: recipitent })
        .lean();

      return followStatus ? followStatus.status : null;
    } catch (error) {
      console.log(error);
    }
  }

  async updateFollowStatus(
    followId: string,
    status: string
  ): Promise<Follow | null | undefined> {
    try {
      const updatedFollowStatus = await followModel
        .findByIdAndUpdate(
          followId,
          { $set: { status: status } },{new:true}
        )
        .lean();

      return updatedFollowStatus;
    } catch (error) {
      console.log(error);
    }
  }
}

export default FollowReposotory;
