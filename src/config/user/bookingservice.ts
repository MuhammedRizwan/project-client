import Booking, { BookingPaload } from "@/interfaces/booking";
import axiosInstance from "@/lib/axiosInstence";

export const create_order = async (data: { amount: number }) => {
  try {
    const response = await axiosInstance.post("/booking/createOrder", data);
    return response.data as {
      success: boolean;
      message: string;
      order: { id: string };
    };
  } catch (error) {
    throw error;
  }
};
export const verify_order = async (data: {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  try {
    const response = await axiosInstance.post("/booking/verifyOrder", data);
    return response.data as {
      success: boolean;
      message: string;
      successpayment: string;
    };
  } catch (error) {
    throw error;
  }
};
export const booking=async(data:BookingPaload)=>{
    try {
        const response = await axiosInstance.post("/booking",data)
        return response.data as {
            success:boolean, message: string, booking:Booking 
        }
    } catch (error) {
       throw error 
    }
}

export const user_booking=async(id:string|undefined)=>{
  try {
    const response = await axiosInstance.get(`/booking/travel-history/${id}`);
    return response.data as{
      success:boolean,message:string,travelHistory:Booking[]
    }
  } catch (error) {
    throw error
  }
}

export const cancel_booking=async(id:string|undefined,data:{booking_status:string,cancellation_reason:string})=>{
  try {
    const response = await axiosInstance.patch(`/booking/cancel/${id}`,data);
    return response.data as {
      success:boolean,message:string,cancelBooking:Booking
    }
  } catch (error) {
    throw error
  }
}

export const fetch_user_booking=async(id:string|undefined)=>{
  try {
    const response = await axiosInstance.get(`/booking/${id}`);
    return response.data as {
      success:boolean,message:string,booking:Booking
    }
  } catch (error) {
    throw error
  }
}
export const completed_travel=async(id:string|undefined)=>{
  try {
    const response = await axiosInstance.get(`/booking/travel-completed/${id}`);
    return response.data as {
      success:boolean,message:string,travelHistory:Booking[]
    }
  } catch (error) {
    throw error
  }
}
