import { Schema } from "mongoose";
import { ProductData } from "./Product";

export interface CartProduct {
  product: Schema.Types.ObjectId;
  quantity: number;
}

export type CartProductData = Pick<
  ProductData,
  "name" | "genericName" | "imageUrl" | "_id" | "price"
>;

export interface CartData {
  product: CartProductData;
  quantity: number;
  _id: string;
}

export interface Cart {
  products: CartProduct[];
  addedBy: Schema.Types.ObjectId;
  totalAmount: string;
}
