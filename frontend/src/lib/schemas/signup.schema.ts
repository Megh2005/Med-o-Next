import { PASSWORD_REGEX } from "@/utils/constants";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z
      .string()
      .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().regex(PASSWORD_REGEX, {
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    }),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .length(10, { message: "Phone number must be 10 digits long" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default signupSchema;
