"use client";
import Spinnerpage from "@/app/loading";
import Header from "@/components/home/Header";
import PackageCard from "@/components/package/PackageCard";
import Footer from "@/components/user/Footer";
import Package from "@/interfaces/package";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Component() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/packages");
        const { packageList } = response.data;
        setPackages(packageList);
      } catch (error) {
        toast.error("Failed to fetch packages");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinnerpage />;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative">
        <Image
          src="/images/luxury bg-2.webp"
          alt="Luxury Packages"
          width={600}
          height={500}
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Luxury Packages
          </h1>
        </div>
        <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-[90%] bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center z-10">
          <input
            type="text"
            placeholder="Search packages"
            className="flex-grow p-2 border rounded"
          />
          <select className="p-2 border rounded">
            <option>All Prices</option>
            <option>₹10000 - ₹20000</option>
            <option>₹20000 - ₹30000</option>
            <option>₹30000+</option>
          </select>
          <select className="p-2 border rounded">
            <option>All Days</option>
            <option>3 Days</option>
            <option>5 Days</option>
            <option>7 Days</option>
          </select>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            Search
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
        <PackageCard packages={packages} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
