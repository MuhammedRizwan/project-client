import Booking from "@/interfaces/booking";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_agent_booking=async(agentId:string|undefined)=>{
    try {
        const response = await axiosInstance.get(`/booking/travel-agency/${agentId}`);
        return response.data 
    } catch (error) {
        throw error
    }
}

export const fetch_one_booking=async(bookingId:string|undefined)=>{
    try {
      const response = await axiosInstance.get(`/booking/${bookingId}`);
      return response.data as {
        success:boolean, message:string, booking:Booking
      }
    } catch (error) {
      throw error
    }
  }
  
  export const change_booking_status=async(bookingId:string|undefined,data:{status:"pending" | "confirmed" | "canceled" | "completed" | undefined})=>{
    try {
      const response= await axiosInstance.patch(`/booking/booking-status/${bookingId}`, data)
      return response.data as {
        success:boolean,message:string,changeBookingstatus:Booking
      }
    } catch (error) {
      throw error
    }
  }