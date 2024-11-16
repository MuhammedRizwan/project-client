import Booking from "@/interfaces/booking";
import Review from "@/interfaces/review";
import axiosInstance from "@/lib/axiosInstence";

export const save_feedback = async (
  bookingId: string|undefined,
  data: {
    user_id: string | undefined;
    package_id: string | undefined;
    rating: number;
    feedback: string;
  }
) => {
  try {
    const response = await axiosInstance.post(`/review/create-review/${bookingId}`, data);
    return response.data as {
      success: boolean;
      message: string;
      booking: Booking;
    };
  } catch (error) {
    throw error;
  }
};

export const edit_feedback = async (
  reviewId: string|undefined,
  data: {
    rating: number;
    feedback: string;
  }
) => {
  try {
    const response = await axiosInstance.patch(`/review/edit-review/${reviewId}`, data);
    return response.data as {
      success: boolean;
      message: string;
      review: Review;
    };
  } catch (error) {
    throw error;
  }
};

export const delete_feedback = async (bookingId: string|undefined,reviewId: string|undefined) => {
  try {
    const response = await axiosInstance.delete(`/review/delete-review/${bookingId}/${reviewId}`);
    return response.data as {
      success: boolean;      
      message: string;
      booking: Booking;
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_review=async(packageId:string)=>{
  try {
    const response=await axiosInstance.get(`/review/${packageId}`)
    return response.data as {
      success:boolean;
      message:string;
      review:Review[]
    }
  } catch (error) {
    throw error
  }
}
