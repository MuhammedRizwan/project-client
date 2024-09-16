"use client";
import { Button, Input } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux-store/store";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { useState } from "react";
import axios from "axios";
import { addUser } from "@/Redux-store/Redux-reducer/userReducer";

interface LoginFormData {
  email: string;
  password: string;
}
export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = async (data: LoginFormData) => {
    const res = await axios.post("http://localhost:5000/login", data);
    if (res.status === 200) {
      dispatch(addUser(res.data));
      if (!res.data.userDetails.is_verifyied) {
        router.push("/verification");
      } else {
        router.push("/");
      }
      try {
      } catch (error) {
        console.log(res.data.error);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-10  ">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p>enter your credentials to access your acount</p>
      </div>

      <div className="px-6">
        <Input
          isClearable
          isRequired
          variant="bordered"
          onClear={() => console.log("input cleared")}
          className="max-w-xs mx-4"
          type="email"
          label="Email"
          placeholder="Type your email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email",
            },
          })}
        />
        <p className="text-red-500 mx-5 text-xs min-h-[20px]">
          {errors.email && errors.email.message}
        </p>
        <Input
          isRequired
          variant="bordered"
          label="Password"
          placeholder="Type your confirm password"
          className="max-w-xs mx-4"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
              message:
                "Password must be at least 8 characters, contain an uppercase letter, and a special character",
            },
          })}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
        />
        <p className="text-red-500 mx-5 text-xs min-h-[20px]">
          {errors.password?.message || ""}
        </p>

        <div className="text-start ms-5 font-semibold">
          <Link href="#" className="text-sm hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="w-1/2 text-end my-3">
          <Button
            type="submit"
            className=" bg-red-700 text-black w-36"
            variant="flat"
          >
            Sign in
          </Button>
        </div>
        <div className="flex items-start text-start p-4 text-sm">
          <div className="text-slate-500 font-semibold w-1/2 flex ">
            <FcGoogle className="m-1" />
            Sign in with Google
          </div>
          <div className="text-slate-500 font-semibold">
            Already have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-red-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
