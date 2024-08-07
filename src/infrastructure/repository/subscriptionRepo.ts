import { Subscription } from "../../domain/entities/subscription";
import ISubscriptionRepo from "../../domain/interfaces/razorpay/ISubscriptionRepo";
import subscriptionModel from "../database/subscription";

class SubscriptionRepo implements ISubscriptionRepo {
  async createNewOrder(
    userId: string,
    amount: string,
    orderId: string,
    paymentId: string,
    product: string
  ): Promise<Subscription | null | undefined> {
    try {
      const order = new subscriptionModel({
        userId,
        amount,
        orderId,
        paymentId,
        product,
      });

      await order.save();

      return order;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrderStatus(_id: string): Promise<void> {
    try {
      await subscriptionModel.findByIdAndUpdate(_id, {
        $set: { status: true },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllOrders(): Promise<Subscription[] | null | undefined> {
    
    try {
      
      const subscriptions = await subscriptionModel.find({}).populate("userId","-password").sort({createdAt:-1}).lean();

      return subscriptions;
    } catch (error) {
      
      console.log(error);
      
    }
  }
}

export default SubscriptionRepo;
