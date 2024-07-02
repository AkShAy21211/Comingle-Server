interface ISubscriptionUseCase{



    handleSubscription(userId:string,amount:number):Promise<any>;
    verifySubscriptionOrder(razorpay_payment_id:string, razorpay_order_id:string , razorpay_signature:string,userId:string,orderId:string,amount:string,product:string):Promise<any>;
    getPlans():Promise<any>

}


export default ISubscriptionUseCase;