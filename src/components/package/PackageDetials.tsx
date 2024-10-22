import Package from "@/interfaces/package";

import { User, Sun, Moon, Star} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function PackageDetials({packageData}:{packageData:Package|null}) {
    const router=useRouter()
  return (
    <div className="min-h-screen flex">
      <div className="w-2/3 flex flex-col justify-center px-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {packageData?.package_name}
        </h1>
        <p className="text-gray-600 mb-6">
          {packageData?.description}
        </p>
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
          <p className="text-sm text-gray-500">Start From {packageData?.departure_place}</p>
          <p className="text-3xl font-bold">
            ₹{packageData?.offer_price}<span className="text-base font-normal">/Person</span>
          </p>
        </div>
        <div>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 mt-2 rounded-md transition-colors mb-6"
        onClick={() => router.push(`/booking/${packageData?._id}`)}
        >
          Book Now
        </button>
        </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">Review</span>
          <span className="mr-2">4.5/5.0</span>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < 4 ? "text-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-1/2">
        <Image
          src={packageData?.images[0]||""}
          alt="Aerial view of coastal landscape"
          width={700}
          className="w-full h-[600px] rounded-none"
          height={610}
          />
      </div>
    </div>
  );
}
