import mongoose, { model, Schema } from "mongoose";
import { bool } from "sharp";
import { Subscription } from "../../domain/entities/subscription";

const subscriptionSchema = new Schema<Subscription>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
    },
    orderId: {
      type: String,
    },

    paymentId: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    product: {
      type: String,
    },
  },
  { timestamps: true }
);

const subscriptionModel = model("subscription", subscriptionSchema);

export default subscriptionModel;
