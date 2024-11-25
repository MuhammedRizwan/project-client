// UserProfile.js
"use client";
import { PasswordChangeFormValues } from "@/components/profile/form/PasswordChangeFrom";
import Agent from "@/interfaces/agent";
import { Button, Input } from "@nextui-org/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AgentInfo from "./AgentInfo";

interface UserProfileProps {
  agent: Agent;
  onSubmit: (data: Agent) => void;
  passwordSubmit: (data: PasswordChangeFormValues) => void;
}

export default function AgentProfile({
  agent,
  onSubmit,
  passwordSubmit,
}: UserProfileProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<PasswordChangeFormValues>()
  const onSubmitPasswordChange: SubmitHandler<
    PasswordChangeFormValues
  > = async (data) => {
    passwordSubmit(data);
  };

  return (
    <main className="w-full">
      <AgentInfo agent={agent} onSubmit={onSubmit}/>
      <form
        onSubmit={handleSubmit(onSubmitPasswordChange)}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
              <Input
                type="password"
                label="Old Password"
                placeholder="Enter your old password"
                {...register("oldPassword", {
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
              <span className="text-red-500 text-xs h-[20px] ms-2">
                {errors?.oldPassword?.message}
              </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                {...register("newPassword", {
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
              <span className="text-red-500 text-xs h-[20px] ms-2">
                {errors.newPassword?.message}
              </span>
            </div>
            <div>
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your new password"
                {...register("confirmPassword", {
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
              <span className="text-red-500 text-xs h-[20px] ms-2">
                {errors.confirmPassword?.message}
              </span>
            </div>
          </div>
          <Button type="submit" color="warning" className="mt-4">
            Change Password
          </Button>
        </div>
      </form>
    </main>
  );
}