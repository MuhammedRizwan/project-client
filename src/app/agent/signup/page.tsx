"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useState } from "react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addAgent } from "@/store/reducer/agentReducer";
import toast from "react-hot-toast";
import useAgent from "@/hooks/useAgent";
import { signup } from "@/config/agent/authservice";

export interface SignupFormData {
  agency_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  location: string;
  document: File|null;
}

export default function SignupForm() {
  useAgent()
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();
  const dispatch = useDispatch<AppDispatch>();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      // const formData = new FormData();
      // formData.append("agency_name", data.username);
      // formData.append("email", data.email);
      // formData.append("phone", data.phone);
      // formData.append("location", data.location);
      // formData.append("password", data.password);

      // if (uploadedFile) {
      //   formData.append("document", uploadedFile);
      // }else{
      //   toast.error("Please Add Any Document")
      //   return
      // }
      data.document=uploadedFile
      const response = await signup(data);
      if (response.success) {        
        const { agent } = response;
        dispatch(addAgent(agent));
        toast.success(response.message);
        router.push("/agent/verification");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Couldn't Register";
        toast.error(errorMessage.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Travel Agency Signup
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-8">
            <div className="flex-1">
              <Input
                size="sm"
                isClearable
                variant="bordered"
                isRequired
                className="w-full mb-4"
                type="text"
                label="Username"
                placeholder="Type your username"
                {...register("agency_name", {
                  required: "Username is required",
                  minLength: {
                    value: 5,
                    message: "Username must be at least 5 characters",
                  },
                })}
              />
              <p className="text-red-500 text-xs min-h-[20px]">
                {errors.agency_name && errors.agency_name.message}
              </p>

              <Input
                size="sm"
                isClearable
                isRequired
                variant="bordered"
                className="w-full mb-4"
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
              <p className="text-red-500 text-xs min-h-[20px]">
                {errors.email && errors.email.message}
              </p>

              <Input
                size="sm"
                isClearable
                isRequired
                variant="bordered"
                className="w-full mb-4"
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
              <p className="text-red-500 text-xs min-h-[20px]">
                {errors.phone && errors.phone.message}
              </p>

              <Input
                size="sm"
                isClearable
                isRequired
                variant="bordered"
                className="w-full mb-4"
                label="Location"
                placeholder="Type your agency location"
                {...register("location", {
                  required: "Location is required",
                })}
              />
              <p className="text-red-500 text-xs min-h-[20px]">
                {errors.location && errors.location.message}
              </p>
              <div className="w-full text-center my-4">
                {loading && loading ? (
                  <Button
                    isLoading
                    type="submit"
                    className="bg-yellow-700 text-black w-1/2"
                    variant="flat"
                  >
                    Sign Up
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-yellow-700 text-black w-1/2"
                    variant="flat"
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Upload Document (PDF/Image)
              </label>
              <input
                type="file"
                className="block w-full text-sm text-gray-900 mb-2"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileUpload}
              />

              {imagePreview ? (
                <div>
                  <p className="text-sm text-gray-600">
                    Uploaded Image Preview:
                  </p>
                  <Image
                    width={32}
                    height={32}
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="w-32 h-32 object-cover rounded-md shadow-md"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    No document uploaded yet
                  </p>
                  <Image
                    width={32}
                    height={32}
                    src="/images/documnet.webp"
                    alt="Dummy Document Preview"
                    className="w-32 h-32 object-cover rounded-md shadow-md"
                  />
                </div>
              )}

              <p className="text-red-500 text-xs min-h-[20px]">
                {errors.document && "Please upload a document (PDF or image)"}
              </p>

              <Input
                size="sm"
                isClearable
                isRequired
                variant="bordered"
                label="Password"
                placeholder="Type your password"
                type={isVisible ? "text" : "password"}
                className="w-full mb-4"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                    message:
                      "Password must contain an uppercase letter, and a special character",
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
              />
              <p className="text-red-500 text-xs min-h-[20px]">
                {errors.password && errors.password.message}
              </p>

              <Input
                size="sm"
                isClearable
                isRequired
                variant="bordered"
                label="Confirm Password"
                placeholder="Type your confirm password"
                className="w-full mb-4"
                type={isVisible ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value, formValues) =>
                    value === formValues.password || "Passwords must match",
                })}
              />
              <p className="text-red-500 text-xs min-h-[20px]">
                {errors.confirmPassword?.message || ""}
              </p>
            </div>
          </div>

          <div className="text-start text-sm mt-4">
            Already have an account?{" "}
            <Link
              href="/agent"
              className="font-bold text-yellow-700 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
