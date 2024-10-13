'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Package from '@/interfaces/package';
import PackageDetials from '@/components/package/PackageDetials';
import PackageDescription from '@/components/package/PackageDescription';
import PackageList from "@/components/package/PackageList";
import toast from 'react-hot-toast';

export default function PackagePage({ params }: { params: { packageId: string } }) {
     const [packageData, setPackageData] = useState<Package | null>(null);
     const [packages, setPackages] = useState<Package[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `http://localhost:5000/packages/${params.packageId}`
            );
            console.log(response.data);
            const { packageData } = response.data;
             setPackageData(packageData);
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
    },[params.packageId]);
    useEffect(()=>{
        const fetchSimilarPackages = async () => {
            try {
              const response = await axios.get(
                `http://localhost:5000/packages/similar/${params.packageId}`
              );
              console.log(response.data);
              const { packages } = response.data;
              setPackages(packages);
            } catch (error) {
              if(axios.isAxiosError(error)) {
                const errorMessage = error.response?.data || "Failed to fetch similar packages";
                toast.error(errorMessage);
              } else {
                toast.error("An unknown error occurred");
              }
            }
        }
        fetchSimilarPackages()
    },[])
  return (
    <div className="min-h-screen bg-white">``
        <PackageDetials packageData={packageData} />
        <PackageDescription packageData={packageData} />
        <PackageList packages={packages} />

    </div>
  )
}