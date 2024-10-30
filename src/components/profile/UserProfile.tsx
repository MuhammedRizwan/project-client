"use client";
import React, { useState, useRef } from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
} from "@nextui-org/react";
import { ChevronDown, Edit } from "lucide-react";
import User from "@/interfaces/user";
import { useForm, SubmitHandler } from "react-hook-form";


export interface PasswordChangeFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserProfileProps {
  user: User;
  onSubmit: (data: User) => void;
  passwordSubmit: (data: PasswordChangeFormValues) => void;
}

export default function UserProfile({ user, onSubmit ,passwordSubmit}: UserProfileProps) {
  const [image, setImage] = useState<string>(user.profile_picture || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeFormValues>();

  const onSubmitPersonalInfo: SubmitHandler<User> = (data) => {
    onSubmit({ ...data, profile_picture: image });
  };

  const onSubmitPasswordChange: SubmitHandler<
    PasswordChangeFormValues
  > = async (data) => {
        passwordSubmit(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="w-full md:w-3/4 md:pl-8">
      {/* Image Upload Section */}

      {/* Personal Information Form */}
      <form onSubmit={handleSubmit(onSubmitPersonalInfo)}>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="relative flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {image ? (
                <Image
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500 flex items-center justify-center h-full">
                  No Image
                </span>
              )}
              {/* Edit Icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md"
              >
                <Edit size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...register("username", { required: "First Name is required" })}
              label="First Name"
              placeholder="Enter your first name"
              isInvalid={!!errors.username}
            />
            {errors.username && <span>{errors.username.message}</span>}

            <Input
              {...register("lastname", { required: "Last Name is required" })}
              label="Last Name"
              placeholder="Enter your last name"
              isInvalid={!!errors.lastname}
            />
            {errors.lastname && <span>{errors.lastname.message}</span>}

            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              label="Email Address"
              placeholder="Enter your email address"
              isInvalid={!!errors.email}
              className="md:col-span-2"
            />
            {errors.email && <span>{errors.email.message}</span>}

            <div className="flex items-center space-x-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="w-20 h-14">
                    +91 <ChevronDown size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Country codes">
                  <DropdownItem key="1">+1</DropdownItem>
                  <DropdownItem key="44">+44</DropdownItem>
                  <DropdownItem key="91">+91</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Input
                {...register("phone", {
                  required: "Phone number is required",
                })}
                label="Phone Number"
                placeholder="Enter your phone number"
                isInvalid={!!errors.phone}
                className="flex-grow"
              />
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>

            <Input
              {...register("address", {
                maxLength: {
                  value: 150,
                  message: "Address cannot exceed 150 characters",
                },
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
              })}
              label="Address"
              placeholder="Enter your address"
              isInvalid={!!errors.address}
              className="md:col-span-2"
            />
            {errors.address && <span>{errors.address.message}</span>}
          </div>

          <Button type="submit" color="primary" className="mt-4">
            Save Personal Info
          </Button>
        </div>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit(onSubmitPasswordChange)}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Change Password</h3>
          <div className="space-y-4">
            <Input
              type="password"
              label="Old Password"
              placeholder="Enter your old password"
              isInvalid={!!passwordErrors.oldPassword}
              {...registerPassword("oldPassword", {
                required: "Old Password is required",
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
            {passwordErrors.oldPassword && (
              <span>{passwordErrors.oldPassword.message}</span>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                isInvalid={!!passwordErrors.newPassword}
                {...registerPassword("newPassword", {
                    required: "New Password is required",
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
              {passwordErrors.newPassword && (
                <span>{passwordErrors.newPassword.message}</span>
              )}

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your new password"
                isInvalid={!!passwordErrors.confirmPassword}
                {...registerPassword("confirmPassword", {
                    required: "Confirm Password is required",
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
             
                <span className="text-xs">{passwordErrors && passwordErrors.confirmPassword?.message}</span>
             
            </div>

            <Button type="submit" color="warning" className="mt-4">
              Change Password
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
