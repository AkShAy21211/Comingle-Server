import SubscriptionUseCase from "../../../userCase/user/subscriptionUseCase";
import { Request, Response } from "express";

class SubscriptionController {
  constructor(private _subscriptionUseCase: SubscriptionUseCase) {}

  async getRazorpayKey(req: Request, res: Response): Promise<void> {
    try {
      const key = process.env.RAZOR_KEY_ID;

      if (key) {
        res.status(200).json({ key });
      } else {
        res.status(400).json({ message: "Key not found" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async subscribeToPremium(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;

      const orderResponse = await this._subscriptionUseCase.handleSubscription(
        req.user?.id as string,
        amount
      );

      console.log(orderResponse);

      if (orderResponse.status) {
        res.status(201).json(orderResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async verifySubscriptionOrder(req: Request, res: Response): Promise<void> {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        orderId,
        amount,
        product,
      } = req.body;

      const verfiyResponse =
        await this._subscriptionUseCase.verifySubscriptionOrder(
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          req.user?.id as string,
          orderId,
          amount,
          product
        );

      if (verfiyResponse.status) {
        res
          .status(200)
          .json({ message: "Payment successfull", verfiyResponse });
      } else {
        res.status(400).json({ message: "Payment failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
}

export default SubscriptionController;
