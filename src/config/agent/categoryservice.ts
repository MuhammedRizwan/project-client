import Category from "@/interfaces/category";
import axiosInstance from "@/lib/axiosInstence";

export const fetch_category=async()=>{
    try {
        const response=await axiosInstance.get("/category/unblocked")
        return response.data as {
            success:boolean,message:string,categories:Category[]
        }
    } catch (error) {
        throw error
    }
}