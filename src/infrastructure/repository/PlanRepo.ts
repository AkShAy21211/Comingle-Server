import plans from "razorpay/dist/types/plans";
import { PlanDetails } from "../../domain/entities/subscription";
import IPremiumPlanRepo from "../../domain/interfaces/admin/IPlanRepo";
import planModel from "../database/planModel";
import IPlanRepo from "../../domain/interfaces/admin/IPlanRepo";

class PlanRepo implements IPlanRepo {
  async getAllPlanDetail(): Promise<PlanDetails[] | null | undefined> {
    try {
      const plans = await planModel.find().lean();
      return plans;
    } catch (error) {
      console.log(error);
    }
  }

  async createNewPan(
    data: PlanDetails
  ): Promise<PlanDetails | null | undefined> {
    try {
      const newPlan = new planModel({
        title: data.title,
        benefits: data.benefits,
        amount: data.amount,
      });

      console.log(newPlan);

      await newPlan.save();
      return newPlan;
    } catch (error) {
      console.log(error);
    }
  }
  async updatePlan(data: PlanDetails): Promise<PlanDetails | null | undefined> {
    try {
      const plan = await planModel.findById(data._id);

      const updatePlan = await planModel
        .findByIdAndUpdate(
          plan?._id,
          {
            $push: {
              benefits: data.benefits || plan?.benefits,
            },
            $set: {
              amount: data.amount || plan?.amount,
              title: data.title || plan?.title,
            },
          },
          { new: true }
        )
        .lean();

      return updatePlan;
    } catch (error) {
      console.log(error);
    }
  }
}

export default PlanRepo;
