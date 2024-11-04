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