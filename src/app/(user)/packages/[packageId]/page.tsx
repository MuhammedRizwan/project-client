'use client'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Package from '@/interfaces/package';

export default function Component({ params }: { params: { packageId: string } }) {
    const [packageData, setPackageData] = useState<Package | null>(null);
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
    },[])
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Image src={packageData?.images[0]||"/default-image.jpg"} alt="Iguazu waterfall" width={600} height={400} className="rounded-lg" />
            <h1 className="text-3xl font-bold mt-4">{packageData?.package_name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-blue-600">₹{packageData?.offer_price}</span>
              <button className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Book Now</button>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600 mr-2">Review 4.5/5</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
          <div>
            <Image src={packageData?.images[1]||"/default-image.jpg"} alt="Another waterfall view" width={500} height={300} className="rounded-lg" />
            <h2 className="text-xl font-semibold mt-4">About {packageData?.package_name}</h2>
            <p className="mt-2 text-gray-600">
              Iguazu Falls, one of the world's largest waterfalls, spans the border between Brazil and Argentina. The falls divide the river into the upper and lower Iguazu. This natural wonder is surrounded by lush subtropical rainforest, home to diverse wildlife.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Package Gallery</h2>
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4">
              <Image src={packageData?.images[0] || "/default-image.jpg"} alt="Waterfall view 1" width={300} height={200} className="rounded-lg" />
              <Image src={packageData?.images[1] || "/default-image.jpg"} alt="Waterfall view 2" width={300} height={200} className="rounded-lg" />
            </div>
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}