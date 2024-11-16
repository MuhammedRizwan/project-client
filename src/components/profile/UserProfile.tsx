// UserProfile.js
"use client";
import React from "react";
import User from "@/interfaces/user";
import PasswordChangeForm, { PasswordChangeFormValues } from "./form/PasswordChangeFrom";
import PersonalInfoForm from "./form/PersonalInfo";

interface UserProfileProps {
  user: User;
  onSubmit: (data: User) => void;
  passwordSubmit: (data: PasswordChangeFormValues) => void;
}

export default function UserProfile({ user, onSubmit, passwordSubmit }: UserProfileProps) {
  return (
    <main className="w-full">
      <PersonalInfoForm user={user} onSubmit={onSubmit} />
      <PasswordChangeForm passwordSubmit={passwordSubmit} user={user} />
    </main>
  );
}
