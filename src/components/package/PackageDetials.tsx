import Package from "@/interfaces/package";
import { Button } from "@nextui-org/react";
import { User, Sun, Moon, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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



  return (
    <div className="min-h-screen flex">
      <div className="w-2/3 flex flex-col justify-center px-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          {packageData?.package_name}
        </h1>
        <p className="text-gray-600 mb-8">{packageData?.description}</p>
        <div className="flex space-x-6 mb-6">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-yellow-500" />
            <span>{packageData?.max_person} Person</span>
          </div>
          <div className="flex items-center">
            <Sun className="w-5 h-5 mr-2 text-yellow-500" />
            <span>{packageData?.no_of_days} Day</span>
          </div>
          <div className="flex items-center">
            <Moon className="w-5 h-5 mr-2 text-yellow-500" />
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
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 mt-2 rounded-md transition-colors mb-6"
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
              <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            {/* Half star if there's a decimal */}
            {rating % 1 !== 0 && (
              <Star
                className="w-5 h-5 text-yellow-400"
                style={{
                  clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)", // Clip half of the star
                }}
                fill="currentColor"
              />
            )}
            {[...Array(5 - Math.ceil(rating))].map((_, index) => (
              <Star key={index + Math.ceil(rating)} className="w-5 h-5 text-gray-400" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-400">{countReview} reviews</span>
        </div>
      </div>

      <div className="w-1/2">
        <Image
          src={packageData?.images[0] || "/fallback-image.jpg"} // Add a fallback image
          alt="Aerial view of coastal landscape"
          width={700}
          height={610}
          className="w-full h-[500px] rounded-none"
        />
      </div>
    </div>
  );
}
