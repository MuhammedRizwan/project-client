"use client";
import { Button, Input } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { useState } from "react";
import axios from "axios";
import { addUser} from "@/store/reducer/userReducer";
import toast from "react-hot-toast";
import { SignIn } from "@/lib/auth-action";
import Cookies from "js-cookie";




interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [loading,setLoading]=useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      const res = await axios.post("http://localhost:5000/login", data);
      if (res.status === 200) {
        const { user,refreshToken,accessToken } = res.data;
       Cookies.set("refreshToken",refreshToken)
       Cookies.set("accessToken",accessToken)
        dispatch(addUser(user));
        if (user.is_verified) {
          toast.success(res.data.message)
          router.back(); 
        } 
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.redirect) {
          const { user} = error.response.data;
          dispatch(addUser(user));
          router.push(error.response.data.redirect);
        } else{
          const errorMessage = error?.response?.data || "Login failed";
        toast.error(errorMessage.message);
        setLoading(false)
        }
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-10">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p>Enter your credentials to access your account</p>
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
          <Link href="/forget-password" className="text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="w-1/2 text-end my-3">
        {loading && loading?(
          <Button
          isLoading
            type="submit"
            className="bg-yellow-600 text-black w-36"
            variant="flat"
          >
            Sign in
          </Button>
        ):(
          <Button
            type="submit"
            className="bg-yellow-600 text-black w-36"
            variant="flat"
          >
            Sign in
          </Button>
        )}
          
        </div>
        

        <div className="flex items-start text-start p- text-sm">
          <div className="text-slate-500 font-semibold w-1/2 flex">
          <Button onClick={() => {
        SignIn()
      }}>
          <FcGoogle className="m-1" />
          Sign in with Google
          </Button>
          
          </div>
          <div className="text-slate-500 font-semibold">
            Do not have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-yellow-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
