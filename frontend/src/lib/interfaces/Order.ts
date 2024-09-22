import { Schema } from "mongoose";
import { Product } from "./Product";

export interface Order {
  orderedBy: Schema.Types.ObjectId;
  items: Product[];
  total: string;
  status: "pending" | "completed" | "cancelled";
  address: Schema.Types.ObjectId;
  transactionId: string;
}

export interface OrderInfo {
  orderedBy: Schema.Types.ObjectId;
  items: Product[];
  total: string;
  status: "pending" | "completed" | "cancelled";
  address: string;
  phoneNumber: string;
}
