import { LoginFormData } from "@/components/admin/AdminLoginForm";
import { MonthlyDataItem } from "@/components/dashboard/bargraph";
import Admin from "@/interfaces/admin";
import Agent from "@/interfaces/agent";
import INotification from "@/interfaces/notification";
import User from "@/interfaces/user";
import Wallet from "@/interfaces/wallet";
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

export const fetchDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/dashboard");
    return response.data as {
      success: boolean;
      message: string;
      users: { usercount: number; unblockeduser: number };
      agent: { agentcount: number; unblockedagent: number };
      packages: { packagecount: number; unblockedpackage: number };
      bookings: {
        bookingcount: number;
        completedbooking: number;
        ongoingbooking: number;
        pendingbooking: number;
        cancelbooking: number;
      };
      revenue: Wallet;
      unconfirmedagency: Agent[] | null;
    };
  } catch (error) {
    throw error;
  }
};

export const getbarChart = async () => {
  try {
    const response = await axiosInstance.get("/bar-chart-data");
    return response.data as {
      success: boolean;
      message: string;
      barChartData:MonthlyDataItem[];
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
  filter: "all" | "blocked" | "unblocked"
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

export const block_agent = async (data: {
  id: string | undefined;
  is_block: boolean;
}) => {
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

export const agent_data = async (agentId: string) => {
  try {
    const response = await axiosInstance.get(`/travel-agencies/${agentId}`);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};

export const verify_agent = async (data: {
  id: string;
  admin_verified: string;
}) => {
  try {
    const response = await axiosInstance.patch("/travel-agencies/verify", data);
    return response.data as {
      success: boolean;
      message: string;
      agent: Agent;
    };
  } catch (error) {
    throw error;
  }
};
export const getAgents = async () => {
  try {
    const response = await axiosInstance.get("/agencies");
    return response.data as {
      success: boolean;
      message: string;
      agents: Agent[];
    };
  } catch (error) {
    throw error;
  }
};
export const agentBookings = async (agentId: string) => {
  try {
    const response = await axiosInstance.get(
      `/agencies-booking-data/${agentId}`
    );
    return response.data as {
      success: boolean;
      message: string;
      bookingData: {
        bookingcount: number;
        completedbooking: number;
        ongoingbooking: number;
        pendingbooking: number;
        cancelbooking: number;
      };
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_admin_notification=async(adminId:string|undefined)=>{
  try {
    const response=await axiosInstance.get(`/notification/admin/${adminId}`)
    return response.data as {
      success:boolean;
      message:string;
      notifications:INotification[]|[]
    }
    
  } catch (error) {
    throw error
  }
}
