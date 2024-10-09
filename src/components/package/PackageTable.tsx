"use client";
import Package from "@/interfaces/package";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function PackageTable({ data }: { data: Package[] }) {
  const router = useRouter();

  return (
    <div className="max-w-6xl h-screen mx-auto bg-white rounded-lg shadow-lg px-5">
      <div className="flex justify-between py-5">
        <div>
          <h1 className="text-2xl font-bold mb-5 text-center">Travel Packages</h1>
        </div>
        <Button
          onClick={() => {
            router.push("/agent/travel-packages/add");
          }}
          className="bg-yellow-600 text-white rounded"
        >
          Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        {/* Corrected conditional check */}
        {data && data.length > 0 ? (
          data.map((pkg, index) => (
            <Card key={index} className="w-full flex flex-row bg-gray-100">
              <div className="relative h-full w-1/3">
                <Image
                  alt={pkg.package_name}
                  src={pkg.images[0] || "/default-image.jpg"}
                  className="rounded-l-lg h-full w-full object-cover"
                />
              </div>
              <CardBody className="flex flex-col w-2/3 px-4">
                <h2 className="text-xl font-semibold mb-2">
                  {pkg.package_name}
                </h2>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 mb-1">
                    Max People:{" "}
                    <span className="font-bold">{pkg.max_person}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Duration:{" "}
                    <span className="font-bold">
                      {pkg.no_of_days} Days / {pkg.no_of_nights}{" "}
                      Nights
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Destinations:{" "}
                  <span className="font-bold">
                    {pkg.destinations.join(", ")}
                  </span>
                </p>
                <p className="text-lg font-bold text-gray-800">
                  Price: ₹{pkg.offer_price}
                </p>
                <div className="flex justify-end space-x-3">
                  <Button color="danger">Block</Button>
                  <Button color="primary">Edit</Button>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <p>No Packages Found</p>
        )}
      </div>
    </div>
  );
}
