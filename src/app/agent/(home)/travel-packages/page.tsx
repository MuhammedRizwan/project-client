"use client";
import Package from "@/interfaces/package";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PackageTable from "@/components/package/PackageTable";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import axiosInstance from "@/lib/axiosInstence";

export default function Packages() {
  const { agent } = useAppSelector((state: RootState) => state.agent);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        if (!agent?._id) {
          setError("Agent ID is missing");
          setLoading(false);
          return;
        }
        const response = await axiosInstance.get(
          `/package/agent/${agent?._id}`
        );
        console.log(response.data);

        const { packageList } = response.data;
        if (packageList && Array.isArray(packageList)) {
          setPackages(packageList);
        } else {
          toast.error("Invalid data format from backend");
        }
      } catch (error) {
        setError("Error fetching packages");
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || "Fetching Failed";
          toast.error(errorMessage.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [agent]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <PackageTable data={packages} />
    </>
  );
}
