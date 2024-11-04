import User from "@/interfaces/user";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_user_profile = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/profile/${id}`);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
    };
  } catch (error) {
    throw error;
  }
};

export const update_profile = async (id: string | undefined, data: User) => {
  try {
    const response = await axiosInstance.put(`/update-profile/${id}`, data);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
    };
  } catch (error) {
    throw error;
  }
};

export const validate_password = async (
  id: string | undefined,
  data: { oldPassword: string }
) => {
  try {
    const response = await axiosInstance.post(`/validate-password/${id}`, {
      oldPassword: data.oldPassword,
    });
    return response.data as {
      success: boolean;
      message: string;
      user: User;
    };
  } catch (error) {
    throw error;
  }
};

export const change_password = async (
  id: string | undefined,
  data: { newPassword: string }
) => {
  try {
    const response = await axiosInstance.put(`/change-password/${id}`, data);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
    };
  } catch (error) {
    throw error;
  }
};
