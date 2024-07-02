import { PlanDetails } from "../../domain/entities/subscription";
import IPremiumPlanRepo from "../../domain/interfaces/admin/IPlanRepo";
import IPlanUseCase from "../../domain/interfaces/admin/IPlanUseCase";
import IPremiumUserCase from "../../domain/interfaces/admin/IPlanUseCase";
import ISubscriptionRepo from "../../domain/interfaces/razorpay/ISubscriptionRepo";

class PlanUserCase implements IPlanUseCase {
  constructor(private _subscriptionPlanRepo: IPremiumPlanRepo, private _subscriptionOrderRepo:ISubscriptionRepo) {}

  async getPlanBenifits(): Promise<any> {
    try {
      const getPLan = await this._subscriptionPlanRepo.getAllPlanDetail();

      if (getPLan) {
        return {
          status: true,
          plans: getPLan,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createPlan(data: PlanDetails): Promise<any> {
    try {
      const newPlan = await this._subscriptionPlanRepo.createNewPan(data);

      if (newPlan) {
        return {
          status: true,
          plan: newPlan,
        };
      } else {
        return {
          status: false,
          plan: "Plan not created please retry",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updatePLan(data: PlanDetails): Promise<any> {
    try {
      const updatedPlan = await this._subscriptionPlanRepo.updatePlan(data);

      if (updatedPlan) {
        return {
          status: true,
          plan: updatedPlan,
        };
      } else {
        return {
          status: false,
          plan: "Plan not updated please retry",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getSubscribedUsers():Promise<any>{

    try {
      
      const subscriptions =await this._subscriptionOrderRepo.getAllOrders();

      if(subscriptions){

        return {

          status:true,
          subscriptions:subscriptions
        }
      }

      return {
        status:false,
        message:'No orders yet'
      }
    } catch (error) {
      console.log(error);
      
    }

  }
}

export default PlanUserCase;
