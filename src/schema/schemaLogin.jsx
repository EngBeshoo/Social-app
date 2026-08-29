import * as zod from "zod";

export const schemaLogin = zod.object({
  email: zod
    .string()
    .nonempty("Please enter your email")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),

  password: zod
    .string()
    .nonempty("Please enter your password")
    .min(4, "Password must be at least 4 characters"),
});