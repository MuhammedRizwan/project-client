import Booking from "@/interfaces/booking";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_agent_booking = async (
  agentId: string | undefined,
  packageId: string | undefined,
  searchTerm: string | undefined,
  currentPage: number,
  limit: number
) => {
  try {
    const response = await axiosInstance.get(
      `/booking/travel-agency/${agentId}/${packageId}?search=${searchTerm}&page=${currentPage}&limit=${limit}`
    );
    return response.data as {
      success: boolean;
      message: string;
      bookingData: Booking[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_one_booking = async (bookingId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/booking/${bookingId}`);
    return response.data as {
      success: boolean;
      message: string;
      booking: Booking;
    };
  } catch (error) {
    throw error;
  }
};

export const change_booking_status = async (
  bookingId: string | undefined,
  data: {
    status: "pending" | "confirmed" | "canceled" | undefined;
    cancellation_reason: string | undefined;
  }
) => {
  try {
    const response = await axiosInstance.patch(
      `/booking/booking-status/${bookingId}`,
      data
    );
    return response.data as {
      success: boolean;
      message: string;
      changeBookingstatus: Booking;
    };
  } catch (error) {
    throw error;
  }
};

export const change_Travel_status = async (
  bookingId: string | undefined,
  data: {
    travel_status:
      | "pending"
      | "on-going"
      | "canceled"
      | "completed"
      | undefined;
  }
) => {
  try {
    const response = await axiosInstance.patch(
      `/booking/travel-status/${bookingId}`,
      data
    );
    return response.data as {
      success: boolean;
      message: string;
      changeTravelstatus: Booking;
    };
  } catch (error) {
    throw error;
  }
};
export const newBookings = async (agentId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/booking/new-bookings/${agentId}`);
    return response.data as {
      success: boolean;
      message: string;
      newBooking: Booking[];
    };
  } catch (error) {
    throw error;
  }
};
