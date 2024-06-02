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
      const followeres = await followModel.find({ requester: id ,$or:[{status:'Pending'},{status:"Approved"}]}).populate('requester').lean();
      return followeres;
      
    } catch (error) {
      console.log(error);
    }
  }
  async getFollowedUser(id: string): Promise<Follow[] | null | undefined> {
     try {
      const followeres = await followModel.find({ recipient: id,$or:[{status:'Pending'},{status:"Approved"}] }).populate('requester','name profile.image email _id').lean();
      
      return followeres;
      
    } catch (error) {
      console.log(error);
    }
  }

  async findFollowBeforeCreatingNewOne(requester: string, recipient: string): Promise<Follow | null | undefined> {
    try {
      
      const existingFollowRequest = await followModel.findOne({recipient:recipient,requester:requester}).lean();

      return existingFollowRequest;
    } catch (error) {
      console.log(error);
      
    }
  }
}

export default FollowReposotory;
