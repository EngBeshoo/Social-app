import { Button, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { schema } from "../../schema/Schema";
import { signUp } from "../../services/registerAPI";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  let [apiError, setApiError] = useState(null);
  let [visible, setVisible] = useState(false);
  let [isLoading, setisLoading] = useState(false);
  let [rePasswordvisible, setRePasswordVisible] = useState(false);
  let [successMessage, setSuccessMessage] = useState(""); 

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "", 
      gender: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  async function submitForm(userData) {
    setisLoading(true)
    setApiError(null); 
    setSuccessMessage(""); 

    try {
      const data = await signUp(userData);
      console.log("Register Success:", data);
      setSuccessMessage("Registration successful! Welcome aboard ");
      navigate('/')
    
    } catch (error) {
      console.error("Register Error:", error);
      setApiError(error.message || "Registration failed. Please try again.");
    }
    setisLoading(false)
  }

  return (
    <div className="bg-gray-300 min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-2xl p-5 bg-white shadow rounded-2xl">
        <h2 className="text-5xl relative w-fit mx-auto font-bold hover:after:w-full text-sky-600 py-3 text-center after:content-[''] after:left-0 after:bottom-1 after:duration-300 after:transition-all after:w-0 after:h-1 after:bg-sky-600 after:absolute">
          Register Now
        </h2>

        <form onSubmit={handleSubmit(submitForm)}>
          <div className="flex flex-col gap-4 py-3">
            
            <div className="flex flex-col sm:flex-row gap-2">
          
              <Input
                {...register("firstName")}
                isInvalid={Boolean(errors.firstName && touchedFields.firstName)}
                errorMessage={errors.firstName?.message}
                label="First Name"
                placeholder="Enter your First Name"
                type="text"
                className="flex-1"
              />

          
              <Input
                {...register("lastName")}
                isInvalid={Boolean(errors.lastName && touchedFields.lastName)}
                errorMessage={errors.lastName?.message}
                label="Last Name"
                placeholder="Enter your Last Name"
                type="text"
                className="flex-1"
              />
            </div>

          
            <Input
              {...register("email")}
              isInvalid={Boolean(errors.email && touchedFields.email)}
              errorMessage={errors.email?.message}
              label="Email"
              placeholder="Enter your email"
              type="email"
            />

           
            <Input
              {...register("password")}
              isInvalid={Boolean(errors.password && touchedFields.password)}
              errorMessage={errors.password?.message}
              label="Password"
              placeholder="Enter your Password"
              type={visible ? "text" : "password"}
              endContent={
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="text-gray-500 hover:text-sky-600"
                >
                  {visible ? "Hide" : "Show"}
                </button>
              }
            />

           
            <Input
              {...register("rePassword")}
              isInvalid={Boolean(errors.rePassword && touchedFields.rePassword)}
              errorMessage={errors.rePassword?.message}
              label="Confirm Password"
              placeholder="Enter your Password again"
              type={rePasswordvisible ? "text" : "password"}
              endContent={
                <button
                  type="button"
                  onClick={() => setRePasswordVisible(!rePasswordvisible)}
                  className="text-gray-500 hover:text-sky-600"
                >
                  {rePasswordvisible ? "Hide" : "Show"}
                </button>
              }
            />

        
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Birth Date */}
              <Input
                {...register("dateOfBirth")} 
                isInvalid={Boolean(errors.dateOfBirth && touchedFields.dateOfBirth)}
                errorMessage={errors.dateOfBirth?.message}
                label="Birth Date"
                type="date"
                className="flex-1"
              />

              {/* Gender */}
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Gender"
                    placeholder="Select your gender"
                    selectedKeys={field.value ? new Set([field.value]) : new Set()}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      field.onChange(value);
                    }}
                    isInvalid={Boolean(errors.gender && touchedFields.gender)}
                    errorMessage={errors.gender?.message}
                    className="flex-1"
                  >
                    <SelectItem key="male">Male</SelectItem>
                    <SelectItem key="female">Female</SelectItem>
                  </Select>
                )}
              />
            </div>
          </div>

    
          {apiError && (
            <p className="text-red-500 py-2 text-center">{apiError}</p>
          )}

          
          {successMessage && (
            <p className="text-green-500 py-2 text-center font-semibold">
              {successMessage}
            </p>
          )}

          {/* Submit Button */}
          <Button
          
            type="submit"
            className="my-4 w-full"
            color="primary"
            variant="shadow"
            isLoading={isLoading}
          >
             Submit
          </Button>
          <p className="text-center">DO you have an account ? <Link className='relative w-fit mx-auto font-bold text-sky-400 hover:text-sky-600 hover:border-b-1 hover:border-b-sky-800  text-center' to='/'>Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}