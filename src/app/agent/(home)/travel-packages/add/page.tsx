'use client'
import { fetch_category } from "@/config/agent/categoryservice";
import { add_package } from "@/config/agent/packageservice";
import PackageForm from "@/components/package/add-edit-form/PackageForm";
import  Agent  from "@/interfaces/agent";
import Category from "@/interfaces/category";
import { PackageFormValues } from "@/interfaces/package";
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
        setCategories(categories)
      }catch(error){
        console.log(error)
      }
    }
    fetchCategories()
  },[router])
  return (
      <PackageForm 
        initialData={undefined}
        categories={categories}
        onSubmit={handleAddPackage}
        formTitle="Add Package"
      />
  );
};

export default AddPackagePage;
