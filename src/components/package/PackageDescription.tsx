import Package from "@/interfaces/package";
import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function LeftPackage({packageData}: {packageData: Package|null}) {
  return (
    <div className="py-16">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="w-full md:w-1/2">
          <Image
            src="/images/luxorios bg-1.webp"
            alt="Machu Picchu during rainy season"
            width={600}
            height={400}
            className="shadow-lg object-cover h-[400px] w-full md:h-[400px]"
          />
        </div>
        <div className="w-full md:w-1/2 mx-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            {packageData?.destinations.join(", ")}
          </h2>
          <p className="text-gray-700 mb-6">
            {packageData?.description}
          </p>
          <Button className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded transition-colors">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
