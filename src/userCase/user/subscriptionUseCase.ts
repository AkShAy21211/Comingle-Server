import ISubscriptionManager from "../../domain/interfaces/razorpay/ISubscriptionManager";
import ISubscriptionRepo from "../../domain/interfaces/razorpay/ISubscriptionRepo";
import ISubscriptionUseCase from "../../domain/interfaces/razorpay/ISubscriptionUseCase";
import IUserReop from "../../domain/interfaces/user/IUserRepo";

class SubscriptionUseCase implements ISubscriptionUseCase {
  constructor(
    private _razorpay: ISubscriptionManager,
    private _subscriptionRepo: ISubscriptionRepo,
    private _userReop: IUserReop
  ) {}

  async handleSubscription(userId: string, amount: number): Promise<any> {
    try {
      const orderId = this._razorpay.generateRecieptId();

      const options = {
        amount: amount*100,
        currency: "INR",
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
          message: "Something went wrong please retry",
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
   
      console.log( userId,
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        product);
      

      const order = await this._subscriptionRepo.createNewOrder(
        userId,
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        product
      );

      const isAuthentic: boolean = await this._razorpay.verifynOrder(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      );

      if (isAuthentic) {
        await this._subscriptionRepo.updateOrderStatus(order?._id as string);
        await this._userReop.updateUser(userId, { premium: true });

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
