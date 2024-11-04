'use client'
import { fetch_category } from "@/api/agent/categoryservice";
import { add_package } from "@/api/agent/packageservice";
import PackageForm, { PackageFormValues } from "@/components/package/PackageForm";
import  Agent  from "@/interfaces/agent";
import Category from "@/interfaces/category";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


const AddPackagePage = () => {
  const router = useRouter();
  const agent:Agent|null=useSelector((state:RootState)=>state.agent.agent)
  const [categories, setCategories] = useState<Category[]>([]); 
  const handleAddPackage = async (data: PackageFormValues) => {
    console.log(data,"add package Data");
    try {
      if(!agent){
        toast.error("Please login to add package");
        return;
      }
      const travel_agent_id=agent._id
      const response = await add_package(travel_agent_id,data);
      if(response.success) {
        router.push("/agent/travel-packages");
        toast.success("Package added successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to add package";
        toast.error(errorMessage);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  useEffect(() => {
    const fetchCategories=async()=>{
      try{
        const response=await fetch_category()
        const {categories}=response
        console.log(categories)
        setCategories(categories)
      }catch(error){
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "Failed to add category";
          toast.error(errorMessage);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    }
    fetchCategories()
  },[])

  return (
    <div>
      <PackageForm 
        initialData={undefined}
        categories={categories}
        onSubmit={handleAddPackage}
        formTitle="Add Package"
      />
    </div>
  );
};

export default AddPackagePage;
