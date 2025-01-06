"use client";
import { fetch_category } from "@/config/agent/categoryservice";
import { fetch_package } from "@/config/user/packageservice";
import Header from "@/components/home/Header";
import PackageCard from "@/components/package/PackageCard";
import SearchInput from "@/components/searchInput";
import Footer from "@/components/user/Footer";
import Category from "@/interfaces/category";
import Package from "@/interfaces/package";
import { Pagination, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Component() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State initialized from query params
  const [categoryId, setCategoryId] = useState<string>(
    searchParams.get("categoryId") || ""
  );
  const [days, setDays] = useState<string>(searchParams.get("days") || "");
  const [startRange, setStartRange] = useState<string>(
    searchParams.get("startRange") || ""
  );
  const [endRange, setEndRange] = useState<string>(
    searchParams.get("endRange") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 12;

  // Fetch packages based on filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_package(
          searchTerm,
          currentPage,
          rowsPerPage,
          categoryId,
          days,
          startRange,
          endRange
        );
        if (response.success) {
          const { packages, totalPages } = response;
          setPackages(packages);
          setTotalPages(totalPages);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [searchTerm, currentPage, categoryId, days, startRange, endRange]);

  // Fetch categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch_category();
        if (response.success) {
          setCategory(response.categories);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);

  // Image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % category.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [category.length]);

  // Handlers for filters
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(event.target.value === "all" ? "" : event.target.value);
  };

  const handlePriceRangeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const priceRange = event.target.value;
    const matches = priceRange.match(/\d+/g);
    setStartRange(matches?.[0] || "");
    setEndRange(matches?.[1] || "");
  };

  const handleDaysChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDays(event.target.value === "all" ? "" : event.target.value);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative">
        <Image
          src={category[currentImageIndex]?.image}
          alt={category[currentImageIndex]?.category_name || "Default"}
          width={600}
          height={500}
          className="w-full h-[500px] object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
            {category[currentImageIndex]?.category_name || "Luxury Packages"}
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Find the best packages for your next journey
          </p>
        </div>
        <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-[90%] bg-white p-4 rounded-lg shadow flex gap-2 items-center z-10">
          <div className="w-full pt-4">
            <SearchInput onSearch={setSearchTerm} />
          </div>
          <div className="mb-3">
            <Select
              className="p-2 w-36"
              label="filter by price:"
              labelPlacement="outside"
              onChange={handlePriceRangeChange}
            >
              <SelectItem key={""}>All Prices</SelectItem>
              <SelectItem key={"₹1000 - ₹5000"}>₹1000 - ₹5000</SelectItem>
              <SelectItem key={"₹6000 - ₹10000"}>₹6000 - ₹10000</SelectItem>
              <SelectItem key={"₹10001 +"}>₹10001+</SelectItem>
            </Select>
          </div>
          <div className="mb-3">
            <Select
              className="p-2 w-36"
              label="days"
              labelPlacement="outside"
              onChange={handleDaysChange}
            >
              <SelectItem key={""}>All Days</SelectItem>
              <SelectItem key={"1"}>1 Days</SelectItem>
              <SelectItem key={"2"}>2 Days</SelectItem>
              <SelectItem key={"3"}>3 Days</SelectItem>
            </Select>
          </div>
          <div className="mb-3">
            <Select
              className="p-2 w-36"
              label="Categories"
              labelPlacement="outside"
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
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-5 px-8 py-12">
        {packages.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center border rounded-lg p-8 shadow-lg bg-white">
              <h2 className="text-2xl font-semibold text-gray-800">
                No Packages Found
              </h2>
              <p className="text-gray-600 mt-2">
                Try adjusting your filters to find the perfect package.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <PackageCard packages={packages} />
          </div>
        )}
        <div className="flex justify-center items-center mt-8">
          <Pagination
            showControls
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={setCurrentPage}
            className="bg-white shadow-md rounded-lg"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
