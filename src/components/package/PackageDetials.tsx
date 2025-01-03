"use client";
import Package from "@/interfaces/package";
import { Button, Card, CardBody } from "@nextui-org/react";
import {
  User,
  Sun,
  Moon,
  Star,
  Clock,
  CloudLightning,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PackageDetialsProps {
  packageData: Package | null;
  countReview: number;
  countRating: number;
}

export default function PackageDetials({
  packageData,
  countReview,
  countRating,
}: PackageDetialsProps) {
  const router = useRouter();
  const rating = countReview ? countRating / countReview : 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (packageData?.images && packageData.images.length > 1) {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % packageData.images.length
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [packageData?.images]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="min-h-screen flex">
        <div className="w-2/3 flex flex-col justify-center px-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            {packageData?.package_name}
          </h1>
          <p className="text-gray-600 mb-8">{packageData?.description}</p>
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              <span>{packageData?.max_person} Person</span>
            </div>
            <div className="flex items-center">
              <Sun className="w-5 h-5 mr-2 text-orange-500" />
              <span>{packageData?.no_of_days} Day</span>
            </div>
            <div className="flex items-center">
              <Moon className="w-5 h-5 mr-2 text-orange-500" />
              <span>{packageData?.no_of_nights} Night</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Start From {packageData?.departure_place}
              </p>
              <p className="text-3xl font-bold">
                ₹{packageData?.offer_price}
                <span className="text-base font-normal">/Person</span>
              </p>
            </div>
            <div>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 mt-2 rounded-md transition-colors mb-6"
                onClick={() => router.push(`/booking/${packageData?._id}`)}
              >
                Book Now
              </Button>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <span className="text-4xl font-bold mr-2">{rating.toFixed(1)}</span>
            <div className="flex">
              {/* Full stars */}
              {[...Array(Math.floor(rating))].map((_, index) => (
                <Star
                  key={index}
                  className="w-5 h-5 fill-orange-400 text-orange-400"
                />
              ))}
              {/* Half star if there's a decimal */}
              {rating % 1 !== 0 && (
                <Star
                  className="w-5 h-5 text-orange-400"
                  style={{
                    clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)", // Clip half of the star
                  }}
                  fill="currentColor"
                />
              )}
              {[...Array(5 - Math.ceil(rating))].map((_, index) => (
                <Star
                  key={index + Math.ceil(rating)}
                  className="w-5 h-5 text-gray-400"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-400">
              {countReview} reviews
            </span>
          </div>
        </div>

        <motion.div
          className="md:w-full relative h-[350px] md:h-[600px] shadow-2xl overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {packageData?.images && packageData.images.length > 0 ? (
            <Image
              src={packageData.images[currentImageIndex]}
              alt={`View of ${packageData.package_name}`}
              layout="fill"
              objectFit="cover"
              className="rounded-none shadow-2xl"
            />
          ) : (
            <Image
              src="/fallback-image.jpg"
              alt="Fallback image"
              layout="fill"
              objectFit="cover"
              className="rounded-none md:rounded-l-3xl shadow-2xl"
            />
          )}
        </motion.div>
      </div>

      <div className=" bg-gradient-to-br from-orange-100 to-white p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Card */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardBody className="flex flex-col items-center gap-2 p-6">
              <Calendar className="w-12 h-12 text-red-500" />
              <h3 className="text-gray-500 font-medium">Today date</h3>
              <p className="text-xl font-bold">
                {currentTime.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </CardBody>
          </Card>

          {/* Time Card */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardBody className="flex flex-col items-center gap-2 p-6">
              <Clock className="w-12 h-12 text-red-500" />
              <h3 className="text-gray-500 font-medium">Current Time</h3>
              <p className="text-xl font-bold">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </CardBody>
          </Card>

          {/* Weather Card */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardBody className="flex flex-col items-center gap-2 p-6">
              <CloudLightning className="w-12 h-12 text-blue-500" />
              <h3 className="text-gray-500 font-medium">Temperature weather</h3>
              <p className="text-xl font-bold">25° C</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
