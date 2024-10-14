"use client";
import { useAppSelector } from "@/store/hooks";
import { addUser } from "@/store/reducer/userReducer";
import { AppDispatch } from "@/store/store";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function OTPInputs() {
  const router = useRouter();
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user} = useAppSelector((state) => state.user);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (
        value !== "" &&
        index < otp.length - 1 &&
        inputRefs.current[index + 1]
      ) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const enteredOtp = otp.join("");
      const res = await axios.post("http://localhost:5000/otpVerification", {
        Otp: enteredOtp,
        user,
      });
      if (res.status === 200) {
        const { user } = res.data;
        dispatch(addUser(user));
        toast.success(res.data.message);
        router.back();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Failed to verify OTP";
        toast.error(errorMessage.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  const handleResendOtp = async () => {
    if (user) {
      try {
        const res = await axios.post("http://localhost:5000/sendotp", {
          email: user.email,
        });
        if (res.status == 200) {
          toast.success(res.data.message);
          setIsResendDisabled(true);
          setTimer(30);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    } else {
      console.error("User or email is undefined");
    }
  };
  return (
    <>
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
      </div>
      <div className="mt-8">
        <Button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Verify OTP
        </Button>

        <p className="mt-2 text-sm text-gray-600">
          Didnt receive the code?{" "}
          {isResendDisabled ? (
            <span className="text-gray-500">Resend OTP in {timer} seconds</span>
          ) : (
            <a
              onClick={handleResendOtp}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Resend OTP
            </a>
          )}
        </p>
      </div>
    </>
  );
}
