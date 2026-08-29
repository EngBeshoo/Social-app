import * as zod from "zod";

export const schema = zod
  .object({
    firstName: zod
      .string()
      .nonempty("Please enter your name")
      .min(3, "Name min 3 char")
      .max(10, "Name max 10 char"),

    lastName: zod
      .string()
      .nonempty("Please enter your name")
      .min(3, "Name min 3 char")
      .max(10, "Name max 10 char"),

    email: zod
      .string()
      .nonempty("please enter your email")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email"
      ),

    password: zod
      .string()
      .nonempty("please enter your password")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Invalid Password"
      ),

    rePassword: zod.string().nonempty("rePassword is required"),

    gender: zod.string().nonempty("Gender is required"),

    dateOfBirth: zod.coerce
      .date("date is required")
      .refine((value) => {
        let userYear = value.getFullYear();
        let dateNow = new Date().getFullYear();
        let userAge = dateNow - userYear;
        return userAge >= 18;
      }, "Age must be 18 or older"),
  })
  .refine((data) => data.password == data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match", 
  });