import Coupon from "@/interfaces/coupon";
import axiosInstance from "@/lib/axiosInstence";

export const block_coupon = async (
  couponId: string | undefined,
  data: { is_active: boolean }
) => {
  try {
    const response = await axiosInstance.patch(
      `/coupon/block/${couponId}`,
      data
    );
    return response.data as {
      success: boolean;
      message: string;
      coupons: Coupon;
    };
  } catch (error) {
    throw error;
  }
};

export const add_edit_coupon = async (
  url: string,
  method: string,
  data: Coupon
) => {
  try {
    const response = await axiosInstance({ url, method, data });
    return response.data as {
      success: boolean;
      message: string;
      couponData: Coupon;
    };
  } catch (error) {
    throw error;
  }
};
