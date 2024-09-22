"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const zod_1 = require("zod");
const addressSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .trim()
        .max(50, { message: "Fullname must be less than 50 characters" }),
    phoneNumber: zod_1.z
        .string()
        .trim()
        .length(10, { message: "Phone number must be 10 digits long" }),
    pincode: zod_1.z
        .string({ message: "Pincode is required" })
        .trim()
        .regex(constants_1.PINCODE_REGEX, { message: "Invalid pincode" }),
    state: zod_1.z
        .string()
        .trim()
        .max(50, { message: "State must be less than 50 characters" }),
    city: zod_1.z.string().max(50, { message: "City must be less than 50 characters" }),
    houseNumber: zod_1.z
        .string()
        .trim()
        .max(50, { message: "House number must be less than 50 characters" }),
    street: zod_1.z
        .string()
        .trim()
        .max(50, { message: "Street must be less than 50 characters" }),
    landmark: zod_1.z
        .string()
        .trim()
        .max(50, { message: "Landmark must be less than 50 characters" }),
});
exports.default = addressSchema;
