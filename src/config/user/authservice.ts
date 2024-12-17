import { ForgetPassword } from "@/app/(user)/forget-password/page";
import { GoogleData } from "@/app/(user)/google/page";
import { LoginFormData } from "@/components/user/forms/LoginForm";
import { SignupFormData } from "@/components/user/forms/SignupForm";
import INotification from "@/interfaces/notification";
import OTP from "@/interfaces/otp";
import User from "@/interfaces/user";
import axiosInstance from "@/lib/axiosInstence";

export const login = async ({ data }: { data: LoginFormData }) => {
  try {
    const response = await axiosInstance.post("/login", data);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
      accessToken: string;
      refreshToken: string;
    };
  } catch (error) {
    throw error;
  }
};
export const signin = async (data: SignupFormData) => {
  try {
    const response = await axiosInstance.post("/signup", data);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
    };
  } catch (error) {
    throw error;
  }
};

export const otp_verification = async (data: {
  otp: string;
  user: User | null;
}) => {
  try {
    const response = await axiosInstance.post("/otpVerification", data);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
      accessToken: string;
      refreshToken: string;
    };
  } catch (error) {
    throw error;
  }
};
export const resend_otp = async (data: { email: string }) => {
  try {
    const response = await axiosInstance.post("/sendotp", data);
    return response.data as {
      success: boolean;
      message: string;
      OTP: OTP;
    };
  } catch (error) {
    throw error;
  }
};
export const google_login = async(data:GoogleData) => {
  try {
    const response =await axiosInstance.post("/googleLogin", data);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
      accessToken: string;
      refreshToken: string;
    };
  } catch (error) {
    throw error;
  }
};

export const changepassword=async(data:ForgetPassword)=>{
    try {
        const response=await axiosInstance.post("/changepassword",data)
        return response.data as{
            success:boolean, message: string, user:User 
        }
    } catch (error) {
        throw error
    }
}


export const filtered_data=async(apiUrl:string,searchTerm:string,currentPage:number,rowsPerPage:number)=>{
  try {
    const response = await axiosInstance.get(
      `${apiUrl}?search=${searchTerm}&page=${currentPage}&limit=${rowsPerPage}`
    );
    return response.data 
  } catch (error) {
    throw error
  }

}
export const fetch_user_notification=async(userId:string|undefined)=>{
  try {
    const response=await axiosInstance.get(`/notification/user/${userId}`)
    return response.data as {
      success:boolean;
      message:string;
      notifications:INotification[]|[]
    }
    
  } catch (error) {
    throw error
  }
}

