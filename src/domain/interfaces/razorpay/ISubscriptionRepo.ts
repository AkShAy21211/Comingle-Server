import { PlanDetails, Subscription } from "../../entities/subscription";

interface ISubscriptionRepo{


    createNewOrder(userId:string,amount:string,orderId:string,paymentId:string,product:string):Promise<Subscription|null|undefined>;
    updateOrderStatus(_id:string):Promise<void>;
    getAllOrders():Promise<Subscription[]|null|undefined>;
}

export default ISubscriptionRepo;