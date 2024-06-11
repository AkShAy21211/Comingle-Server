import { Order, OrderResponse } from "../../entities/subscription";

interface ISubscriptionManager {

    generateRecieptId():string;
    createSubscriptionOrder(options:Order):Promise<any>;
    verifynOrder(razorpay_payment_id:string, razorpay_order_id:string , razorpay_signature:string):Promise<boolean>;
}

export default ISubscriptionManager