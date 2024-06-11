import ISubscriptionManager from "../../domain/interfaces/razorpay/ISubscriptionManager";
import ISubscriptionRepo from "../../domain/interfaces/razorpay/ISubscriptionRepo";
import ISubscriptionUseCase from "../../domain/interfaces/razorpay/ISubscriptionUseCase";

class SubscriptionUseCase implements ISubscriptionUseCase {
  constructor(
    private _razorpay: ISubscriptionManager,
    private _subscriptionRepo: ISubscriptionRepo
  ) {}

  async handleSubscription(userId: string, amount: string): Promise<any> {
    try {
      const orderId = this._razorpay.generateRecieptId();

      const options = {
        amount: amount,
        currency: "INR",
        receipt: orderId,
        payment_capture: 1,
      };

      const order = await this._razorpay.createSubscriptionOrder(options);

      if (order) {
        return {
          status: true,
          order,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async verifySubscriptionOrder(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    userId: string,
    orderId: string,
    amount: string,
    product: string
  ): Promise<any> {
    try {
      const order = await this._subscriptionRepo.createNewOrder(
        userId,
        amount,
        orderId,
        product
      );

      const isAuthentic: boolean = await this._razorpay.verifynOrder(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      );

      console.log('--------------------',isAuthentic);
      
      if (isAuthentic) {
        await this._subscriptionRepo.updateOrderStatus(order?._id as string);

        return {
          status: true,
          order_id: orderId,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default SubscriptionUseCase;
