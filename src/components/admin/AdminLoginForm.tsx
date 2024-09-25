"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { useState } from "react";
import axios from "axios";
import { addAdmin } from "@/store/reducer/adminReducer";

interface LoginFormData {
  email: string;
  password: string;
}
export default function AdminLoginForm() {
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
    const res = await axios.post("http://localhost:5000/admin/login", data);
    if (res.status === 200) {
      dispatch(addAdmin(res.data));
      router.push("/admin/dashboard");
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

        <div className="text-start ms-5 font-semibold">
          <Link
            href="/agent/forget-password"
            className="text-sm hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="w-1/2 text-end my-3">
          <Button
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
