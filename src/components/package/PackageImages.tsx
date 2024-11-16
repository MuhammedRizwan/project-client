"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Package from "@/interfaces/package";

export default function PackageImages({
  packageData,
}: {
  packageData: Package | null;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!packageData) {
    return <div>Loading...</div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === packageData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? packageData.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="w-full">
        <CardBody className="p-0 overflow-hidden">
          <div className="relative">
            <Image
              src={packageData.images[currentImageIndex]}
              alt={`${packageData.destinations.join(", ")} - Image ${
                currentImageIndex + 1
              }`}
              width={1200}
              height={600}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <Button
              isIconOnly
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white"
              onPress={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              isIconOnly
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white"
              onPress={nextImage}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </Button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {packageData.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col md:flex-row items-start gap-6 p-6">
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {packageData.destinations.join(", ")}
            </h2>
            <p className="text-gray-700 mb-6">{packageData.description}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
