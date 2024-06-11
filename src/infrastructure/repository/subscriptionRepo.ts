import { Subscription } from "../../domain/entities/subscription";
import ISubscriptionRepo from "../../domain/interfaces/razorpay/ISubscriptionRepo";
import subscriptionModel from "../database/subscription";

class SubscriptionRepo implements ISubscriptionRepo {
  async createNewOrder(
    userId: string,
    amount: string,
    orderId: string,
    product:string
  ): Promise<Subscription|null|undefined> {
    try {
      const order = new subscriptionModel({
        userId,
        amount,
        orderId,
        product
      });

      await order.save();

      return order;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrderStatus(_id: string): Promise<void> {
    try {
      await subscriptionModel.findByIdAndUpdate(
        _id,
        { $set: { status: true } }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default SubscriptionRepo;
