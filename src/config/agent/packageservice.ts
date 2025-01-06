import Package, { PackageFormValues } from "@/interfaces/package";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_agent_package = async (
  id: string | undefined,
  searchTerm: string,
  currentPage: number,
  itemPerPage: number
) => {
  try {
    const response = await axiosInstance.get(
      `/package/agent/${id}?search=${searchTerm}&page=${currentPage}&limit=${itemPerPage}`
    );
    return response.data as {
      success: boolean;
      message: string;
      packages: Package[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
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
export const add_package = async (
  agentId: string | undefined,
  data: PackageFormValues
) => {
  try {
    const response = await axiosInstance.post(
      "/package/add",
      { agentId, ...data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
  console.log(error)
    throw error;
  }
};
export const block_package = async (
  packageId: string | undefined,
  data: { is_block: boolean }
) => {
  try {
    const response = await axiosInstance.patch(
      `/package/block/${packageId}`,
      data
    );
    return response.data as {
      success: boolean;
      message: string;
      Package: Package;
    };
  } catch (error) {
    throw error;
  }
};

export const updateImageURL = async (data: FormData) => {
  try {
    const response = await axiosInstance.post("/package/update-image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data as {
      success: boolean;
      message: string;
      imageUrl: string;
    };
  } catch (error) {
    throw error;
  }
};
export const deleteImageUrl = async (publicId:string) => {
  try {
    const response = await axiosInstance.post("/package/delete-image", {publicId});
    return response.data as {
      success: boolean;
      message: string;
    };
  } catch (error) {
    throw error;
  }
};


