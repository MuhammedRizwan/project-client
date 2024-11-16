import Coupon from "@/interfaces/coupon";
import axiosInstance from "@/lib/axiosInstence";


export const apply_coupon=async(id:string|undefined,userId:string|undefined,totalPrice:number)=>{
    try {
        const response = await axiosInstance.post(`/coupon/used/${id}`, {
            userId,
            totalPrice,
          });
          return response.data as {
            success:boolean, message: string, discountAmount:number
          }
    } catch (error) {
        throw error
    }
}

export const fetch_unblocked_coupon=async()=>{
    try {
        const response = await axiosInstance.get(`/coupon/unblocked`);
        return response.data as{
            success:boolean, message:string, coupons:Coupon[]
        }
    } catch (error) {
        throw error
    }
}