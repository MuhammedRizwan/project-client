"use client";

import PackageForm, {
  PackageFormValues,
} from "@/components/package/PackageForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // If you're using Next.js router
import { Category } from "@/interfaces/category";
import axiosInstance from "@/lib/axiosInstence";

const EditPackagePage = ({ params }: { params: { pid: string } }) => {
  const [initialData, setInitialData] = useState<PackageFormValues | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  // Fetch the existing package data from API
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(`/agent/package/${params.pid}`);
      console.log(response);
      const { packageData } = response.data;
      setInitialData(packageData);
    };

    const fetchCategories = async () => {
      const response = await axiosInstance.get("/agent/category");
      const { categories: categoriesData } = response.data;
      setCategories(categoriesData);
    };

    fetchData();
    fetchCategories();
  }, [params.pid]);

  // Handle form submission
  const handleFormSubmit = async (data: PackageFormValues) => {
    const response = await axiosInstance.put(
      `/agent/package/edit/${params.pid}`,
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
