import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export default signinSchema;
