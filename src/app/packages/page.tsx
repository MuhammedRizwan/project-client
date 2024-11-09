"use client";
import { fetch_category } from "@/api/agent/categoryservice";
import { fetch_package } from "@/api/user/packageservice";
import Header from "@/components/home/Header";
import PackageCard from "@/components/package/PackageCard";
import SearchInput from "@/components/searchInput";
import Footer from "@/components/user/Footer";
import Category from "@/interfaces/category";
import Package from "@/interfaces/package";
import { Pagination, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Component() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string>("");
  const [days, setDays] = useState<string>("");
  const [startRange, setStartRange] = useState<string>("");
  const [endRange, setEndRange] = useState<string>("");
  const rowsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_package(
          searchTerm,
          currentPage,
          rowsPerPage,
          categoryId,
          days,startRange,endRange
        );
        if (response.success) {
          const { packages, totalPages } = response;
          setPackages(packages);
          setTotalPages(totalPages);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Failed to fetch packages");
        }
      }
    };
    fetchData();
  }, [categoryId, currentPage, days, endRange, searchTerm, startRange]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch_category();
        if (response.success) {
          setCategory(response.categories);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Failed to fetch packages");
        }
      }
    };
    fetchCategory();
  }, []);
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(event.target.value);
  };
  const handlePriceRangeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const priceRange = event.target.value;
    const matches = priceRange.match(/\d+/g);

    if (matches && matches.length >= 2) {
      setStartRange(matches[0]);
      setEndRange(matches[1]);
    }else if(matches && matches.length === 1){
      setStartRange(matches[0]);
    }
  };
  const handleDaysChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDays(event.target.value);
  };

  useEffect(() => {
    const contentInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % category.length);
    }, 10000); // 10 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(contentInterval);
  }, [category.length]);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative">
        <Image
          src={category[currentImageIndex]?.image}
          alt="Luxury Packages"
          width={600}
          height={500}
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {category[currentImageIndex]?.category_name}
          </h1>
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
              <SelectItem key={"₹10000 - ₹20000"}>₹10000 - ₹20000</SelectItem>
              <SelectItem key={"₹20000 - ₹30000"}>₹20000 - ₹30000</SelectItem>
              <SelectItem key={"₹30000+"}>₹30000+</SelectItem>
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
              {category.map((cat) => (
                <SelectItem key={cat._id} className="w-full">
                  {cat.category_name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-16 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
          <PackageCard packages={packages} />
        </div>
        <div className="flex justify-center items-center mt-4">
          <Pagination
            showControls
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
