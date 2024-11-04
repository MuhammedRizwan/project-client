"use client";
import { changepassword, resend_otp } from "@/api/user/authservice";
import useUser from "@/hooks/useUser";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface ForgetPassword {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ForgotPassword() {
  useUser()
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpData, setOtpData] = useState("");
  const [verified, setVerified] = useState({ email: "", otp: "" });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(0);
  const [showResendLink, setShowResendLink] = useState(false);
  const [loader, setLoader] = useState({
    email: false,
    verify: false,
    changepassword: false,
  });

  useEffect(() => {
    if (timer > 0 && !isOtpVerified) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setShowResendLink(true);
      setOtpData("");
    }
  }, [timer, isOtpVerified]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgetPassword>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (data: ForgetPassword) => {
    try {
      setLoader((prev) => ({ ...prev, email: true }));
      const response = await resend_otp({
        email: data.email,
      });
      if (response.success) {
        const { otp } = response.OTP;
        setOtpData(otp);
        setVerified((prev) => ({ ...prev, email: "verified" }));
        setTimer(60);
        setShowResendLink(false);
        toast.success("Email verified");
        toast.success("OTP send");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Not verified";
        toast.error(errorMessage.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoader((prev) => ({ ...prev, email: false }));
    }
  };

  const handleVerifyOtp = () => {
    try {
      setLoader((prev) => ({ ...prev, verify: true }));
      const enteredOtp = otp.join("");
      if (otpData != "") {
        if (enteredOtp === otpData) {
          setIsOtpVerified(true);
        } else {
          toast.error("Invalid OTP!");
        }
      } else {
        toast.error("Insert a valid otp");
      }
    } catch (error) {
      const err=error as Error
      toast.error(err.message);
    } finally {
      setLoader((prev) => ({ ...prev, verify: false }));
    }
  };

  const handleChangePassword = async (data: ForgetPassword) => {
    try {
      setLoader((prev) => ({ ...prev, changepassword: true }));
      const response = await changepassword({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (response.success) {
        toast.success(response.message);
        router.push("/login");
      }
    } catch (error) {
       if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data || "Couldn't change password";
    toast.error(errorMessage.message);
  } else {
    toast.error("An unknown error occurred");
  }
    } finally {
      setLoader((prev) => ({ ...prev, verify: false }));
    }
  };

  const handleResendOtp = async () => {
    setOtp(["", "", "", ""]);
    handleSubmit(handleSendOtp);
  };

  return (
    <div className="flex items-center justify-center max-h-[700px] h-screen bg-gray-100">
      <div className="bg-white p-14 rounded-md shadow-lg max-w-[800px] w-full">
        <form onSubmit={handleSubmit(handleSendOtp)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <div className="flex">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email",
                  },
                })}
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Type your email"
                disabled={verified.email == "" ? false : true}
              />
              {loader.email && loader.email ? (
                <Button
                  isLoading
                  type="submit"
                  className="bg-yellow-600 text-white ms-2 hover:bg-yellow-700"
                >
                  Send OTP
                </Button>
              ) : (
                <Button
                  disabled={verified.email == "" ? false : true}
                  type="submit"
                  className="bg-yellow-600 text-white ms-2 hover:bg-yellow-700"
                >
                  Send OTP
                </Button>
              )}
            </div>
            <p className="text-red-500 text-sm min-h-[20px]">
              {errors.email && errors.email.message}{" "}
              {verified.email && (
                <span className="text-green-500">{verified.email}</span>
              )}
            </p>
          </div>
        </form>

        <div className="mb-4">
          <label className="block text-gray-700">OTP</label>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 rounded-md border border-gray-300 text-center font-bold text-gray-600"
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            ))}
            {loader.verify && loader.verify ? (
              <Button
                isLoading
                onClick={handleVerifyOtp}
                className="bg-yellow-600 text-white mt-1 hover:bg-yellow-700"
              >
                Verify
              </Button>
            ) : (
              <Button
                disabled={verified.otp == "" ? false : true}
                onClick={handleVerifyOtp}
                className="bg-yellow-600 text-white mt-1 hover:bg-yellow-700"
              >
                Verify
              </Button>
            )}
          </div>
          <p className="text-green-500 text-sm min-h-[20px]">
            {isOtpVerified ? (
              "OTP verified"
            ) : timer > 0 ? (
              `Time remaining: ${timer} seconds`
            ) : showResendLink ? (
              <a href="#" onClick={handleResendOtp} className="text-blue-500">
                Resend OTP
              </a>
            ) : null}
          </p>
        </div>

        {isOtpVerified && (
          <form onSubmit={handleSubmit(handleChangePassword)}>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
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
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm min-h-[20px]">
                  {errors.password && errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords must match",
                })}
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm min-h-[20px]">
                  {errors.confirmPassword && errors.confirmPassword.message}
                </p>
              )}
            </div>
            {loader.changepassword && loader.changepassword ? 
              <Button
              isLoading
                type="submit"
                className=" bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700"
              >
                Change
              </Button>
             : 
              <Button
                type="submit"
                className=" bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700"
              >
                Change
              </Button>
            }
          </form>
        )}
      </div>
    </div>
  );
}
