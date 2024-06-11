import { Order, OrderResponse } from "../../domain/entities/subscription";
import ISubscriptionManager from "../../domain/interfaces/razorpay/ISubscriptionManager";
import razorpayInstance from "../config/razorpay";
import crypto from "crypto";

class SubscriptionManager implements ISubscriptionManager {
  generateRecieptId(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0"); // Generate a 3-digit random number
    return `order_${timestamp}_${random}`;
  }

  async createSubscriptionOrder(options: Order): Promise<any> {
    try {
      const order = await razorpayInstance.orders.create(options);

      return order;
    } catch (error) {
      console.log(error);
    }
  }

  async verifynOrder(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string
  ): Promise<any> {
    try {
      const signature = razorpay_order_id+"|"+razorpay_payment_id;

      const isExpectedSignature = crypto
        .createHmac("sha256", process.env.RAZOR_KEY_SECRET as string)
        .update(signature.toString())
        .digest("hex");

      const isAuthentic = isExpectedSignature === razorpay_signature;

      console.log(razorpay_signature);
      
      console.log('00000000000000000000000000000000000',isExpectedSignature);
      
      return isAuthentic;
    } catch (error) {

      console.log(error);
      
    }
  }
}

export default SubscriptionManager;
