"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/home/Header";
import Package from "@/interfaces/package";
import PackageDetials from "@/components/package/PackageDetials";
import PackageDescription from "@/components/package/PackageDescription";
import PackageCard from "@/components/package/PackageCard";
import toast from "react-hot-toast";
import { fetch_one_package, similar_packages } from "@/api/user/packageservice";
import PackageImages from "@/components/package/PackageImages";


export default function PackagePage({
  params,
}: {
  params: { packageId: string };
}) {
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_one_package(params.packageId);
        const { packageData } = response;
        setPackageData(packageData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params.packageId]);
  useEffect(() => {
    const fetchSimilarPackages = async () => {
      try {
        const response = await similar_packages(params.packageId);
        const { packageList } = response;
        setPackages(packageList);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data || "Failed to fetch similar packages";
          toast.error(errorMessage);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    fetchSimilarPackages();
  }, [params.packageId]);
  return (
    <div className="min-h-screen bg-white">
        <Header/>
      <PackageDetials packageData={packageData} />
      <PackageImages packageData={packageData}/>
      <PackageDescription packageData={packageData} />
      <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold px-10 mb-2">Similar Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6 px-10">
            <PackageCard packages={packages} />
        </div>
      </div>
    </div>
  );
}
