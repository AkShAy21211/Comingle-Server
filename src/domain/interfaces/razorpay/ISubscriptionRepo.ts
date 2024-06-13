import { Subscription } from "../../entities/subscription";

interface ISubscriptionRepo{


    createNewOrder(userId:string,amount:string,orderId:string,paymentId:string,product:string):Promise<Subscription|null|undefined>;
    updateOrderStatus(_id:string):Promise<void>
}

export default ISubscriptionRepo;