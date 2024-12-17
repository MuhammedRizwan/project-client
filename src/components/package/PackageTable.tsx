"use client";
import React from "react";
import Package from "@/interfaces/package";
import { Card, CardBody, Image, Button, Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import SearchInput from "../searchInput";

interface PackageTableProps {
  data: Package[];
  onBlock: (pkg: Package) => void;
  setSearchTerm:(name:string)=>void; 
  totalPages:number;
  currentPage:number;
  setCurrentPage:(page:number)=>void
}

export default function PackageTable({ data, onBlock,setSearchTerm,totalPages,currentPage,setCurrentPage }: PackageTableProps) {
  const router = useRouter();
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg px-5 h-full overflow-y-auto">
      <div className="flex justify-between py-5 items-center">
        <h1 className="text-2xl font-bold">Travel Packages</h1>
      </div>
      <div className="flex justify-between mb-5">
      <div className="w-1/2">
      <SearchInput
            onSearch={setSearchTerm}
          />
      </div>
      <Button
          onClick={() => {
            router.push("/agent/travel-packages/add");
          }}
          className="bg-orange-500 text-white rounded"
        >
          Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {data && data.length > 0 ? (
          data.map((pkg, index) => (
            <Card
              key={pkg._id || index}
              className="flex flex-col md:flex-row bg-gray-100"
              isHoverable
            >
              <div className="relative h-44 md:h-52 w-full md:w-1/3">
                <Image
                  alt={pkg.package_name}
                  src={pkg.images?.[0] || "/default-image.jpg"}
                  className="rounded-l-lg h-full w-full object-cover"
                />
              </div>
              <CardBody className="flex flex-col justify-between p-4 w-full md:w-2/3">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {pkg.package_name}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <p className="text-sm text-gray-600">
                      Max People:{" "}
                      <span className="font-bold">{pkg.max_person}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration:{" "}
                      <span className="font-bold">
                        {pkg.no_of_days} Days / {pkg.no_of_nights} Nights
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Destinations:{" "}
                    <span className="font-bold">
                      {pkg.destinations.join(", ")}
                    </span>
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    Price: ₹{pkg.offer_price}
                  </p>
                </div>
                <div className="flex justify-end space-x-3 mt-3">
                  <Button
                    className="bg-zinc-900 text-white"
                    onClick={() => router.push(`/agent/bookings/package/${pkg._id}`)}
                  >
                    bookings
                  </Button>
                  <Button
                    className={
                      pkg.is_block ? "bg-green-700" : "bg-red-700"
                    }
                    onClick={() => onBlock(pkg)}
                  >
                    {pkg.is_block ? "Unblock" : "Block"}
                  </Button>
                  <Button
                    className="bg-zinc-900 text-white"
                    onClick={() =>
                      router.push(`/agent/travel-packages/edit/${pkg._id}`)
                    }
                  >
                    Edit
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No Packages Found</p>
        )}
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
  );
}
