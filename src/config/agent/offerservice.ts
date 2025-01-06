import Offer from "@/interfaces/offer";
import Package from "@/interfaces/package";
import axiosInstance from "@/lib/axiosInstence";

export const add_offer = async (data: Offer) => {
  try {
    const response = await axiosInstance.post(`/offer/add-offer`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data as {
      success: boolean;
      message: string;
      offer: Offer;
    };
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const fetch_one_offers = async (offerId: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      `/offer/fetch-one-offer/${offerId}`
    );
    return response.data as {
      success: boolean;
      message: string;
      offer: Offer;
    };
  } catch (error) {
    throw error;
  }
};

export const update_offer = async (
  offerId: string | undefined,
  data: Offer
) => {
  console.log(data);
  try {
    const response = await axiosInstance.put(`/offer/update-offer/${offerId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data as {
      success: boolean;
      message: string;
      offer: Offer;
    };
  } catch (error) {
    console.log(error)
    throw error;
  }
};
export const block_offer = async (offerId: string | undefined, data:{is_active:boolean}) => {
  try {
    const response = await axiosInstance.patch(`/offer/block-offer/${offerId}`, data);
    return response.data as {
      success: boolean;
      message: string;
      offer: Offer;
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_offer_package = async (agentId: string | undefined) => {
    try {    
      const response = await axiosInstance.get(`/offer/addPackage/${agentId}`);
      return response.data as {
        success: boolean;
        message: string;
        packages: Package[];
      };
    } catch (error) {
      throw error;
    }
  }




