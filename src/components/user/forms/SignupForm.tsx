"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux-store/store";
import { addUser } from "@/Redux-store/Redux-reducer/userReducer";
import { useState } from "react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import axios from "axios";
import { useRouter } from "next/navigation";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await axios.post("http://localhost:5000/signup", data);
      if (res.status === 201) {
        dispatch(addUser(res.data.userDetails));
        localStorage.setItem("token", JSON.stringify(res.data.acessToken));
        if (!res.data.userDetails.is_verifyied) {
          router.push("/verification");
        }
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log("User already exists");
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="px-6">
      <p className="pt-4">{}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          size="sm"
          isClearable
          variant="bordered"
          isRequired
          onClear={() => console.log("input cleared")}
          className="max-w-xs mx-4"
          type="text"
          label="Username"
          placeholder="Type your username"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 5,
              message: "Username must be at least 5 characters",
            },
          })}
        />
        <p className="text-red-500 mx-5 text-xs min-h-[20px]">
          {errors.username && errors.username.message}
        </p>

        <Input
          size="sm"
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
          size="sm"
          isClearable
          isRequired
          variant="bordered"
          onClear={() => console.log("input cleared")}
          className="max-w-xs mx-4"
          type="text"
          label="Phone"
          placeholder="Type your phone"
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Phone number must be 10 digits",
            },
          })}
        />
        <p className="text-red-500 mx-5 text-xs min-h-[20px]">
          {errors.phone && errors.phone.message}
        </p>

        <Input
          size="sm"
          isClearable
          type="password"
          variant="bordered"
          label="Password"
          isRequired
          onClear={() => console.log("input cleared")}
          placeholder="Type your password"
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
        />
        <p className="text-red-500 mx-5 text-xs min-h-[20px]">
          {errors.password && errors.password.message}
        </p>

        <Input
          size="sm"
          isRequired
          variant="bordered"
          label="Confirm Password"
          placeholder="Type your confirm password"
          className="max-w-xs mx-4"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value, formValues) =>
              value === formValues.password || "Passwords must match",
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
          {errors.confirmPassword?.message || ""}
        </p>

        <div className="text-start ms-5 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-red-600 hover:underline"
          >
            Sign in
          </Link>
        </div>

        <div className="w-1/2 text-end my-3">
          <Button
            type="submit"
            className="bg-red-700 text-black w-36"
            variant="flat"
          >
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}
