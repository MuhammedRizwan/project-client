import { CategoryFormValues } from "@/components/modal/CategoryModal";
import Category from "@/interfaces/category";
import axiosInstance from "@/lib/axiosInstence";

export const add_category = async (data: CategoryFormValues) => {
  try {
    const response = await axiosInstance.post("/category/add", data);
    return response.data as {
      success: boolean;
      message: string;
      category: Category;
    };
  } catch (error) {
    throw error;
  }
};
export const edit_category=async(id:string,data:CategoryFormValues)=>{
    try {
        const response = await axiosInstance.post(`/category/update/${id}`, data);
        return response.data as{
            success:boolean, message:string, category:Category 
        }
    } catch (error) {
        throw error
    }
}
export const block_category = async (data: {
  id: string;
  is_block: boolean;
}) => {
  try {
    const response = await axiosInstance.patch("/category/block", data);
    return response.data as {
      success: boolean;
      message: string;
      category: Category;
    };
  } catch (error) {
    throw error;
  }
};
