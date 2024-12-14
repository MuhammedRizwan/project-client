import Wallet from "@/interfaces/wallet";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_admin_wallet = async (adminId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/wallet/${adminId}`);
    return response.data as {
      success: boolean;
      message: string;
      wallet: Wallet;
    };
  } catch (error) {
    throw error;
  }
};
