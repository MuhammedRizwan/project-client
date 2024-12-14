import { ForgetPassword } from "@/app/(user)/forget-password/page";
import { SignupFormData } from "@/app/agent/signup/page";
import { LoginFormData } from "@/components/agent/forms/AgentLoginForm";
import Agent from "@/interfaces/agent";
import OTP from "@/interfaces/otp";
import axiosInstance from "@/lib/axiosInstence";

export const agent_login = async (data: LoginFormData) => {
  try {
    const response = await axiosInstance.post("/agent/login", data);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
      accessToken: string;
      refreshToken: string;
    };
  } catch (error) {
    throw error;
  }
};

export const signup = async (formData: SignupFormData) => {
  try {
    const response = await axiosInstance.post("/agent/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};

export const send_otp = async (data: { email: string }) => {
  try {
    const response = await axiosInstance.post("/agent/sendotp", data);
    return response.data as {
      success: boolean;
      message: string;
      OTPData: OTP;
    };
  } catch (error) {
    throw error;
  }
};

export const otp_verification = async (data: {
  Otp: string;
  agent: Agent | null;
}) => {
  try {
    const response = await axiosInstance.post("/agent/otpVerification", data);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};

export const change_password = async (data: ForgetPassword) => {
  try {
    const response = await axiosInstance.post("/agent/changepassword", data);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_agent_profile = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};

export const update_agent_profile = async (
  id: string | undefined,
  data: Agent
) => {
  try {
    const response = await axiosInstance.put(`/update/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};

export const validate_agent_password = async (
  id: string | undefined,
  data: { oldPassword: string | undefined }
) => {
  try {
    const response = await axiosInstance.post(`/validate-password/${id}`, data);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};
export const change_agent_password = async (
  id: string | undefined,
  data: { newPassword: string }
) => {
  try {
    const response = await axiosInstance.patch(`/change-password/${id}`, data);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};
export const fetchAgentDashboardData = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/dashboard/${id}`);
    return response.data as {
      success: boolean;
      message: string;
      packages: {
        packagecount: number;
        unblockedpackage: number;
      };
      booking: {
        totalbooking: number;
        completed: number;
        ongoing: number;
        pending: number;
        cancel: number;
      };
      bookingRevenue: number;
    };
  } catch (error) {
    throw error;
  }
};
