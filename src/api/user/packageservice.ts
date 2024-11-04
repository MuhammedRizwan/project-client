import Package from "@/interfaces/package";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_package = async () => {
  try {
    const response = await axiosInstance.get("/packages");
    return response.data as {
      success: boolean;
      message: string;
      packageList: Package[];
    };
  } catch (error) {
    throw error;
  }
};
export const fetch_one_package = async (packageId: string) => {
  try {
    const response = await axiosInstance.get(`/packages/${packageId}`);
    return response.data as {
      success: boolean;
      message: string;
      packageData: Package;
    };
  } catch (error) {
    throw error;
  }
};

export const similar_packages = async (packageId: string) => {
  try {
    const response = await axiosInstance.get(`/packages/similar/${packageId}`);
    return response.data as {
      success: boolean;
      message: string;
      packageList: Package[];
    };
  } catch (error) {
    throw error;
  }
};
