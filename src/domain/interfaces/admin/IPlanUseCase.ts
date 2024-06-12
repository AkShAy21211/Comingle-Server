import { PlanDetails } from "../../entities/subscription";

interface IPlanUseCase {
  getPlanBenifits(): Promise<any>;
  createPlan(data: PlanDetails): Promise<any>;
  updatePLan(data: PlanDetails): Promise<any>;
}

export default IPlanUseCase;
