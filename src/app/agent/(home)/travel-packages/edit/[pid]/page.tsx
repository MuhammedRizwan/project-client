"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import  Category  from "@/interfaces/category";
import axios from "axios";
import toast from "react-hot-toast";
import { edit_package, fetch_agent_one_package } from "@/config/agent/packageservice";
import { fetch_category } from "@/config/agent/categoryservice";
import { PackageFormValues } from "@/interfaces/package";
import PackageForm from "@/components/package/add-edit-form/PackageForm";


const EditPackagePage = ({ params }: { params: { pid: string } }) => {
  const [initialData, setInitialData] = useState<PackageFormValues | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_agent_one_package(params.pid);
        if(response.success){
          const { packageData } = response;
          setInitialData(packageData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch_category();
        const { categories: categoriesData } = response;
        setCategories(categoriesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    fetchCategories();
  }, [params.pid]);

  const handleFormSubmit = async (data: PackageFormValues) => {
    try {
      const response = await edit_package(params.pid,data);
      if (response.success) {
        router.push("/agent/travel-packages");
      } 
    } catch (error) {
      if(axios.isAxiosError(error)){
        toast.error(error.response?.data.message)
      }else{
        toast.error("couldn't update package")
      }
    }
  };

  if (!initialData) {
    return <p>Loading...</p>;
  }

  return (
    <PackageForm
      initialData={initialData}
      categories={categories}
      onSubmit={handleFormSubmit}
      formTitle="Edit"
    />
  );
};

export default EditPackagePage;
