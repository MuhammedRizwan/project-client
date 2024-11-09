import { LoginFormData } from "@/components/admin/AdminLoginForm";
import Admin from "@/interfaces/admin";
import Agent from "@/interfaces/agent";
import User from "@/interfaces/user";
import axiosInstance from "@/lib/axiosInstence";

export const admin_login = async (data: LoginFormData) => {
  try {
    const response = await axiosInstance.post("/admin/login", data);
    return response.data as {
      success: boolean;
      message: string;
      admin: Admin;
      accessToken: string;
      refreshToken: string;
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_table_data = async (
  apiUrl: string,
  searchTerm: string,
  currentPage: number,
  rowsPerPage: number,
  filter:"all" | "blocked" | "unblocked"
) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}?search=${searchTerm}&page=${currentPage}&limit=${rowsPerPage}&filter=${filter}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const block_user = async (data: {
  id: string | undefined;
  is_block: boolean;
}) => {
  try {
    const response = await axiosInstance.patch("/user/block", data);
    return response.data as {
      success: boolean;
      message: string;
      user: User;
    };
  } catch (error) {
    throw error;
  }
};

export const block_agent = async (data: { id: string|undefined; is_block: boolean }) => {
  try {
    const response = await axiosInstance.patch("/travel-agencies/block", data);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};

export const agent_data=async(agentId:string)=>{
    try {
        const response = await axiosInstance.get(`/travel-agencies/${agentId}`);
        return response.data as {
            success:boolean, message:string, agent:Agent 
        }
    } catch (error) {
        throw error
    }
}

export const verify_agent=async(data:{id:string,admin_verified:string})=>{
    try {
        const response = await axiosInstance.patch("/travel-agencies/verify", data);   
        return response.data as {
            success:boolean,
            message:string,
            agent:Agent,
        }
    } catch (error) {
        throw error
    }
}
