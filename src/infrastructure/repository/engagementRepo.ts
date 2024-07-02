import e from "express";
import Engagement from "../../domain/entities/engagemant";
import IEngagementRepo from "../../domain/interfaces/admin/IEngagementRepo";
import engagementModal from "../database/engagementModal";

class EngagementReposotory implements IEngagementRepo {
  async createEngagements(data: {
    type: string;
    count: Number;
  }): Promise<Engagement | null | undefined> {
    try {
      const newEngagement = new engagementModal({
        likeConut: data.type === "likeConut" ? data.count : 0,
        commentCount: data.type === "commentCount" ? data.count : 0,
        followConut: data.type === "followConut" ? data.count : 0,
        postCount: data.type === "postCount" ? data.count : 0,
      });

      await newEngagement.save();

      return newEngagement;
    } catch (error) {
      console.log(error);
    }
  }

  async updateEngagement(type: string): Promise<any> {
    try {
      // Get the start of the day

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get the end of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const engagement = await engagementModal.updateOne(
        {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        {
          $inc: { [type]: 1 },
        }
      );

      return engagement;
    } catch (error) {
      console.log(error);
    }
  }
  async findEngagementOfTheDay(): Promise<any> {
    try {
      // Get the start of the day

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get the end of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const engagement = await engagementModal.findOne({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      return engagement;
    } catch (error) {
      console.log(error);
    }
  }
  async getEngagement(): Promise<Engagement[] | null | undefined> {
    try {
      const engagements = await engagementModal.find({});

      return engagements;
    } catch (error) {
      console.log(error);
    }
  }
}

export default EngagementReposotory;
