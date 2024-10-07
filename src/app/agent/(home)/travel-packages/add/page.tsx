'use client'
import PackageForm, { PackageFormValues } from "@/components/package/PackageForm";
import { Agent } from "@/interfaces/agent";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


const AddPackagePage = () => {
  const router = useRouter();
  const agent:Agent|null=useSelector((state:RootState)=>state.agent.agent)
  const [categories, setCategories] = useState([]); 
  const handleAddPackage = async (data: PackageFormValues) => {
    try {
      if(!agent){
        toast.error("Please login to add package");
        return;
      }
      const res = await axios.post("http://localhost:5000/agent/package/add",{agentId:agent._id, ...data},{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(res.status === 201) {
        router.push("/agent/travel-packages");
        toast.success("Package added successfully");
      }else{
        console.log(res.data);
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
        const res=await axios.get("http://localhost:5000/agent/category")
        const {categories}=res.data
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
      <h1>Add New Package</h1>
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
