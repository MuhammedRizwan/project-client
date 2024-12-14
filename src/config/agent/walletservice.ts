import Wallet from "@/interfaces/wallet";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_agent_wallet = async (agentId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/wallet/${agentId}`);
    return response.data as {
        success:boolean,
        message:string,
        wallet:Wallet
    }
  } catch (error) {
    throw error;
  }
};
