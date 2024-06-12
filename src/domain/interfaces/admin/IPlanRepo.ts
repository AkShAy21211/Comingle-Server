import { PlanDetails } from "../../entities/subscription";

interface IPlanRepo{

    getAllPlanDetail():Promise<PlanDetails[]|null|undefined>;
    createNewPan(data:PlanDetails):Promise<PlanDetails|null|undefined>;
    updatePlan(date:PlanDetails):Promise<PlanDetails|null|undefined>;
}

export default   IPlanRepo