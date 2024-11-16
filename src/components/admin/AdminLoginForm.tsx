"use client";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { useState } from "react";
import axios from "axios";
import { addAdmin } from "@/store/reducer/adminReducer";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { admin_login } from "@/config/admin/authservice";

export interface LoginFormData {
  email: string;
  password: string;
}
export default function AdminLoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      const response = await admin_login( data);
      if (response.success) {
        const { admin,refreshToken,accessToken } = response;
        Cookies.set("adminRefreshToken",refreshToken)
        Cookies.set("adminToken",accessToken)
        dispatch(addAdmin(admin));
        toast.success(response.message);
        router.push("/admin/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Login failed";
        toast.error(errorMessage.message);
      } else {
        toast.error("An unknown error occurred");
      }
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-10  ">
        <h1 className="text-3xl font-bold">ADMIN LOGIN</h1>
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

      
        <div className="w-1/2 text-end my-3">
          <Button
          isLoading={loading}
            type="submit"
            className="  bg-yellow-600 text-black w-36"
            variant="flat"
          >
            Sign in
          </Button>
        </div>
      </div>
    </form>
  );
}
