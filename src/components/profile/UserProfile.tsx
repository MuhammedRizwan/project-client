"use client";
import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import User from "@/interfaces/user";
import { useForm, SubmitHandler } from "react-hook-form";

interface PasswordChangeFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserProfile({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeFormValues>();

  const onSubmitPersonalInfo: SubmitHandler<User> = (data) => {
    toast.success("Personal information submitted!");
    console.log("Personal Info:", data);
  };

  const onSubmitPasswordChange: SubmitHandler<PasswordChangeFormValues> = (
    data
  ) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    toast.success("Password changed successfully!");
    console.log("Password Change:", data);
  };

  return (
    <main className="w-full md:w-3/4 md:pl-8">
      {/* Personal Information Form */}
      <form onSubmit={handleSubmit(onSubmitPersonalInfo)}>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
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
              {...registerPassword("oldPassword", {
                required: "Old Password is required",
              })}
              type="password"
              label="Old Password"
              placeholder="Enter your old password"
              isInvalid={!!passwordErrors.oldPassword}
            />
            {passwordErrors.oldPassword && (
              <span>{passwordErrors.oldPassword.message}</span>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...registerPassword("newPassword", {
                  required: "New Password is required",
                })}
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                isInvalid={!!passwordErrors.newPassword}
              />
              {passwordErrors.newPassword && (
                <span>{passwordErrors.newPassword.message}</span>
              )}

              <Input
                {...registerPassword("confirmPassword", {
                  required: "Confirm Password is required",
                })}
                type="password"
                label="Confirm Password"
                placeholder="Confirm your new password"
                isInvalid={!!passwordErrors.confirmPassword}
              />
              {passwordErrors.confirmPassword && (
                <span>{passwordErrors.confirmPassword.message}</span>
              )}
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
