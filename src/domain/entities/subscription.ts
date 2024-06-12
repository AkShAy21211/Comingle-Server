import mongoose, { mongo } from "mongoose";

interface Order{

    amount:string;
    currency:string;
    receipt:string;
}

interface OrderResponse{
    
  id: string,
  entity: string,
  amount: number,
  amount_paid: number,
  amount_due: number,
  currency: string,
  receipt: string,
  status: string,
  attempts: number,
  notes: [],
  created_at:Date;

}

interface Subscription{

  _id:string;
  userId:mongoose.Schema.Types.ObjectId;
  amount:number;
  orderId:string;
  status:boolean;
  product:string;

}


interface PlanDetails{

  _id:string;
  title:string;
  benefits:string[];
  amount:number;
}
export {Order,OrderResponse,Subscription,PlanDetails}