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
        console.log(error);
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

  useEffect(() => {
    const contentInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % category.length);
    }, 10000); 
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
