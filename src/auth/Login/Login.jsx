import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { schemaLogin } from "../../schema/schemaLogin";
import { signin } from "../../services/loginApi";
import { AuthContext } from "../../context/authContext";

export default function Login() {
  let { setuserToken }= useContext(AuthContext)
  let [apiError, setApiError] = useState(null);
  let [visible, setVisible] = useState(false);
  let [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schemaLogin),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });


  useEffect(() => {
    const users = localStorage.getItem('registeredUsers');
    console.log("📦 Current users in localStorage:", users ? JSON.parse(users) : []);
  }, []);

  async function submitForm(userData) {
    setApiError(null);
    setSuccessMessage("");

    try {
      const data = await signin(userData);
      console.log("✅ Login Success:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMessage("Login successful! Welcome back 🎉");
      setuserToken(data.token)
      navigate('/home');
    
    } catch (error) {
      console.error("❌ Login Error:", error);
      setApiError(error.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="bg-gray-300 min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md p-5 bg-white shadow rounded-2xl">
        <h2 className="text-5xl text-sky-600 relative w-fit mx-auto font-bold hover:text-sky-800 py-3 text-center border-b-2 border-b-transparent hover:border-b-sky-800 transition-all duration-300">
          Log in
        </h2>

        <form onSubmit={handleSubmit(submitForm)}>
          <div className="flex flex-col gap-4 py-3">
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
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 my-2">
              <p className="text-red-600 text-center">{apiError}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 my-2">
              <p className="text-green-600 text-center font-semibold">
                {successMessage}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="my-4 w-full"
            color="primary"
            variant="shadow"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to='/register'
              className="font-bold text-sky-500 hover:text-sky-700 hover:border-b-2 hover:border-b-sky-700 transition-all duration-300"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}