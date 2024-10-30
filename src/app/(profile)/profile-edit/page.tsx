"use client";
import UserProfile, {
  PasswordChangeFormValues,
} from "@/components/profile/UserProfile";
import User from "@/interfaces/user";
import axiosInstance from "@/lib/axiosInstence";
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
        const response = await axiosInstance.get(`/profile/${userData?._id}`);
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Failed to fetch profile");
        }
      }
    };

    fetchUserData();
  }, [userData?._id]); // Only refetch when userData._id changes

  const handleSubmit = async (data: User) => {
    try {
      const response = await axiosInstance.put(
        `/update-profile/${userData?._id}`,
        data
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(addUser(response.data.user));
        setUser(response.data.user);
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

      const validateResponse = await axiosInstance.post(
        `/validate-password/${userData?._id}`,
        { oldPassword: data.oldPassword }
      );

      if (validateResponse.status !== 200) {
        toast.error("Old password is incorrect");
        return;
      }

      const updateResponse = await axiosInstance.put(
        `/change-password/${userData?._id}`,
        { newPassword: data.newPassword }
      );

      if (updateResponse.status === 200) {
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
