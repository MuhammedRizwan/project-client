import { PackageFormValues } from "@/components/package/PackageForm";
import Package from "@/interfaces/package";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_agent_package = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/package/agent/${id}`);
    return response.data as {
      success: boolean;
      message: string;
      packageList: Package[];
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_agent_one_package = async (
  packageId: string | undefined
) => {
  try {
    const response = await axiosInstance.get(`/package/${packageId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const add_package = async (agentId:string|undefined,
    data: PackageFormValues
  ) => {
    try {
        const response = await axiosInstance.post("/package/add",{agentId, ...data},{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      return response.data as {
        success: boolean;
        message: string;
        data: Package;
      };
    } catch (error) {
      throw error;
    }
  };

export const edit_package = async (
  packageId: string | undefined,
  data: PackageFormValues
) => {
  try {
    const response = await axiosInstance.put(
      `/package/edit/${packageId}`,
      data
    );
    return response.data as {
      success: boolean;
      message: string;
      data: Package;
    };
  } catch (error) {
    throw error;
  }
};
