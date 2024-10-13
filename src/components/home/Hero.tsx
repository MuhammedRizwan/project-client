import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
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
          <div className="hidden lg:flex absolute z-10 mt-10 bg-white p-4 rounded-lg  items-center gap-5 ">
            {/* Input Fields */}
            <SelectInput 
              options={["2 Adult", "1 Adult", "3 Adult", "4 Adult"]}
            />
            <SelectInput
              options={[
                "12 - 13 April 2021",
                "14 - 15 April 2021",
                "16 - 17 April 2021",
              ]}
            />
            <SelectInput
              options={[
                "Luxury Packages",
                "Budget Packages",
                "Adventure Packages",
              ]}
            />

            {/* Book Package Button */}
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 ms-8 px-6 rounded-md transition-colors">
              Book package
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
function SelectInput({ options }: { options: string[] }) {
  return (
    <div className="relative w-full md:w-auto">
      <select className="appearance-none bg-white text-gray-800 py-2 px-2 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );
}
