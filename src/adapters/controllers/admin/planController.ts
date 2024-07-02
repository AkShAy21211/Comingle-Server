import { responseEncoding } from "axios";
import SubscriptionPlanRepo from "../../../infrastructure/repository/PlanRepo";
import PlanUserCase from "../../../userCase/admin/PlanUseCase";
import SubscriptionUseCase from "../../../userCase/user/subscriptionUseCase";
import { Request, Response } from "express";
class PlanController {
  constructor(private _planUseCase: PlanUserCase) {}

  async getPlansDetails(req: Request, res: Response): Promise<void> {
    try {
      const plansResponse = await this._planUseCase.getPlanBenifits();

      if (plansResponse) {
        res.status(200).json(plansResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Interal server error" });

      console.log(error);
    }
  }

  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const { data } = req.body;
      console.log(data);

      const newPlanResponse = await this._planUseCase.createPlan(data);

      if (newPlanResponse.status) {
        res.status(201).json(newPlanResponse);
      } else {
        res.status(400).json(newPlanResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Interal server error" });

      console.log(error);
    }
  }

  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { data } = req.body;
      const updatePlanResponse = await this._planUseCase.updatePLan(data);

      if (updatePlanResponse.status) {
        res.status(200).json(updatePlanResponse);
      } else {
        res.status(400).json(updatePlanResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Interal server error" });

      console.log(error);
    }
  }

  async getSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const subscriptions = await this._planUseCase.getSubscribedUsers();

      if (subscriptions.status) {
        res.status(200).json(subscriptions);
      }else{

        res.json(subscriptions)
      }
    } catch (error) {

      console.log(error);
      
    }
  }
}

export default PlanController;
