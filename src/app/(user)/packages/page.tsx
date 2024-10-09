'use client'
import Package from "@/interfaces/package";
import axios from "axios";
import { Bed, Plane, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Component() {
    const router=useRouter()
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/packages"
        );
        console.log(response.data);
        const { packageList } = response.data;
        setPackages(packageList);
      } catch (error) {
        toast.error("Failed to fetch packages");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[]);
  console.log(packages)
  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/luxury bg-2.webp')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Luxury Packages
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-wrap gap-4 items-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((dest, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={dest.images[0]}
                alt={dest.package_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{dest.package_name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <Bed size={20} />
                    <Plane size={20} />
                    <Car size={20} />
                  </div>
                  <span className="text-yellow-600 font-bold">
                    {dest.offer_price}
                  </span>
                </div>
                <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700" 
                onClick={()=>router.push('/packages/'+dest._id)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
