"use client";
import { change_password, fetch_user_profile, update_profile, validate_password } from "@/api/user/profileservice";
import UserProfile, {
  PasswordChangeFormValues,
} from "@/components/profile/UserProfile";
import User from "@/interfaces/user";
import { addUser } from "@/store/reducer/userReducer";
import { RootState } from "@/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileEdit() {
  const userData = useSelector((state: RootState) => state.user.user);
  const [user, setUser] = useState<User | null>(null); // Type User | null
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch_user_profile(userData?._id);
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Failed to fetch profile");
        }else{
          toast.error("couldn't fetch user data")
        }
      }
    };

    fetchUserData();
  }, [userData?._id]); // Only refetch when userData._id changes

  const handleSubmit = async (data: User) => {
    try {
      const response = await update_profile(userData?._id,data);
      if (response.success) {
        toast.success(response.message);
        dispatch(addUser(response.user));
        setUser(response.user);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Profile update failed");
      } else {
        toast.error("Something went wrong while updating profile");
      }
    }
  };

  const passwordSubmit = async (data: PasswordChangeFormValues) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      const validateResponse = await validate_password(userData?._id,{ oldPassword: data.oldPassword });

      if (validateResponse.success) {
        toast.error("Old password is incorrect");
        return;
      }

      const updateResponse = await change_password(userData?._id,{ newPassword: data.newPassword });

      if (updateResponse.success) {
        toast.success("Password changed successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Password change failed");
      } else {
        toast.error("Something went wrong while changing password");
      }
    }
  };

  return (
    user && (
      <UserProfile
        user={user}
        onSubmit={handleSubmit}
        passwordSubmit={passwordSubmit}
      />
    )
  );
}
