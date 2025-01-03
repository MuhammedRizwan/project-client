'use client'
import Image from "next/image";

import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import Category from "@/interfaces/category";
import { fetch_category } from "@/config/agent/categoryservice";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router=useRouter()
  const [category, setCategory] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [days, setDays] = useState<string>("");
  const [startRange, setStartRange] = useState<string>("");
  const [endRange, setEndRange] = useState<string>("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch_category();
        if (response.success) {
          setCategory(response.categories);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "all") {
      setCategoryId("");
    }
    setCategoryId(event.target.value);
  };
  const handlePriceRangeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const priceRange = event.target.value;
    const matches = priceRange.match(/\d+/g);

    if (matches && matches.length >= 2) {
      setStartRange(matches[0]);
      setEndRange(matches[1]);
    } else if (matches && matches.length === 1) {
      setStartRange(matches[0]);
    } else {
      setStartRange("");
      setEndRange("");
    }
  };

  const handleDaysChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "all") {
      setDays("");
    }
    setDays(event.target.value);
  };
  const handleSearch = () => {
    // Construct query parameters
    const queryParams = new URLSearchParams();

    if (categoryId) queryParams.append("categoryId", categoryId);
    if (days) queryParams.append("days", days);
    if (startRange) queryParams.append("startRange", startRange);
    if (endRange) queryParams.append("endRange", endRange);

    // Navigate to the package page with query parameters
    router.push(`/packages?${queryParams.toString()}`);
  };
  return (
    <div className="relative min-h-screen flex">
      {/* Left Content Section */}
      <div className="w-2/3 flex flex-col justify-center px-16 bg-white">
        <div className="max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-10 mt-20 leading-snug">
            Travel far, explore often, and let each journey bring new
            discoveries
          </h1>
          <p className="text-md text-gray-600 mb-4">
            Travel is a journey of discovery, revealing new places, people, and
            experiences. Each adventure enriches your life, teaching you about
            the world and yourself. Embrace every moment, for through travel, we
            grow and find joy in the endless possibilities of life.
          </p>

          {/* Input Fields */}
          <div className="hidden lg:flex absolute z-10 mt-10 bg-white pe-4 py-2 rounded-lg  items-center gap-5 ">
            {/* Input Fields */}
            <Select
              className="w-40"
              label="days"
              labelPlacement="inside"
              onChange={handleDaysChange}
            >
              <SelectItem key={""}>All Days</SelectItem>
              <SelectItem key={"1"}>1 Days</SelectItem>
              <SelectItem key={"2"}>2 Days</SelectItem>
              <SelectItem key={"3"}>3 Days</SelectItem>
            </Select>
            <Select
              className="w-40"
              label="filter by price:"
              labelPlacement="inside"
              onChange={handlePriceRangeChange}
            >
              <SelectItem key={""}>All Prices</SelectItem>
              <SelectItem key={"₹1000 - ₹5000"}>₹1000 - ₹5000</SelectItem>
              <SelectItem key={"₹6000 - ₹10000"}>₹6000 - ₹10000</SelectItem>
              <SelectItem key={"₹10001 +"}>₹10001+</SelectItem>
            </Select>
            <Select
              className="w-40"
              label="Categories"
              labelPlacement="inside"
              onChange={handleCategoryChange}
            >
              <SelectItem key={""}>All Categories</SelectItem>
              {
                category.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </SelectItem>
                )) as unknown as JSX.Element
              }
            </Select>

            {/* Book Package Button */}
            <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold p-3 ms-3  px-6 rounded-md transition-colors"
            onClick={handleSearch}>
              Available Packages
            </button>
          </div>
          {/* Logo Section */}
          <div className="flex items-center space-x-4 mt-52">
            {["/logos/expedia.png", "/logos/booking.com.png", "/logos/airbnb.png", "/logos/tripadvisor.png", "/logos/trivago.png"].map(
              (logo) => (
                <Image
                  key={logo}
                  src={logo}
                  alt={logo}
                  width={100}
                  height={30}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="w-1/2 relative">
        <Image
          src="/images/homepicture1.jpg"
          alt="Aerial view of coastal landscape"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
    </div>
  );
}

