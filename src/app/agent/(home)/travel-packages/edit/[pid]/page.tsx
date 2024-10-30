"use client";

import PackageForm, {
  PackageFormValues,
} from "@/components/package/PackageForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import  Category  from "@/interfaces/category";
import axiosInstance from "@/lib/axiosInstence";

const EditPackagePage = ({ params }: { params: { pid: string } }) => {
  const [initialData, setInitialData] = useState<PackageFormValues | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(`/package/${params.pid}`);
      console.log(response.data,"package Data");
      const { packageData } = response.data;
      setInitialData(packageData);
    };

    const fetchCategories = async () => {
      const response = await axiosInstance.get("/category/agent");
      const { categories: categoriesData } = response.data;
      setCategories(categoriesData);
    };

    fetchData();
    fetchCategories();
  }, [params.pid]);

  const handleFormSubmit = async (data: PackageFormValues) => {
    console.log(data);
    const response = await axiosInstance.put(
      `/package/edit/${params.pid}`,
      data
    );
    if (response.status === 200) {
      router.push("/agent/travel-packages");
    } else {
      alert("Failed to update the package.");
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
