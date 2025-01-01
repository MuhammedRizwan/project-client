import Wallet from "@/interfaces/wallet";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_wallet=async(id:string|undefined)=>{
    try {
        const response = await axiosInstance.get(`/wallet/${id}`);
        return response.data as{
            success:boolean,
            message: string,
             wallet:Wallet
        }
    } catch (error) {
        throw error
    }
}
export const wallet_payment = async (data: { userId: string|undefined; amount: number }) => {
    try {
      const response = await axiosInstance.post("/wallet/check-balance", data);
      return response.data as {
        success: boolean;
        message: string;
        wallet: Wallet;
      };
    } catch (error) {
      throw error;
    }
  };