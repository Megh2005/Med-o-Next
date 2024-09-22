import { PINCODE_REGEX } from "../../utils/constants";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(50, { message: "Fullname must be less than 50 characters" }),
  phoneNumber: z
    .string()
    .trim()
    .length(10, { message: "Phone number must be 10 digits long" }),
  pincode: z
    .string({ message: "Pincode is required" })
    .trim()
    .regex(PINCODE_REGEX, { message: "Invalid pincode" }),
  state: z
    .string()
    .trim()
    .max(50, { message: "State must be less than 50 characters" }),
  city: z.string().max(50, { message: "City must be less than 50 characters" }),
  houseNumber: z
    .string()
    .trim()
    .max(50, { message: "House number must be less than 50 characters" }),
  street: z
    .string()
    .trim()
    .max(50, { message: "Street must be less than 50 characters" }),
  landmark: z
    .string()
    .trim()
    .max(50, { message: "Landmark must be less than 50 characters" }),
});

export default addressSchema;
