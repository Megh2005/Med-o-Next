import { Schema } from "mongoose";

export interface Address {
  addressOf: Schema.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  pincode: string;
  state: string;
  city: string;
  houseNumber: string;
  street: string;
  landmark: string;
}

export interface AddressData extends Address {
  _id: string;
}
