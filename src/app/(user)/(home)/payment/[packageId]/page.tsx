'use client'
import Image from 'next/image'
import { User, Sun, Moon } from 'lucide-react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Package from '@/interfaces/package';

export default function IguazuConfirmation({ params }:{ params: { packageId: string } }) {
  const [packageData, setPackageData] = useState<Package | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/packages/${params.packageId}`
        );
        const { packageData } = response.data;
        setPackageData(packageData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params.packageId]);
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border border-gray-200 p-8 shadow-lg">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
           {packageData?.package_name}
          </h1>
          <p className="text-gray-600 mb-6">
            {packageData?.description}
          </p>
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              <span>{packageData?.max_person} Person</span>
            </div>
            <div className="flex items-center">
              <Sun className="w-5 h-5 mr-2 text-blue-500" />
              <span>{packageData?.no_of_days} Day</span>
            </div>
            <div className="flex items-center">
              <Moon className="w-5 h-5 mr-2 text-indigo-500" />
              <span>{packageData?.no_of_nights} Night</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-semibold text-green-600">Booked</span>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded transition-colors">
              Details
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src={packageData?.images[0] ||""}
            alt={packageData?.package_name||""}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div className="mt-12 relative">
        <Image
          src="/images/thank you.png"
          alt="Thank You watercolor background"
          width={400}
          height={200}
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900">Thank You</h2>
        </div>
      </div>
    </div>
  )
}
