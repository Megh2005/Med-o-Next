"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const zod_1 = require("zod");
const signupSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .max(50, { message: "Name must be less than 50 characters" }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string().regex(constants_1.PASSWORD_REGEX, {
        message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    }),
    confirmPassword: zod_1.z.string(),
    phoneNumber: zod_1.z
        .string()
        .length(10, { message: "Phone number must be 10 digits long" }),
})
    .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.default = signupSchema;
