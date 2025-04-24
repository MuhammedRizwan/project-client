import { DataContent } from "@/app/page";
import { Button } from "@nextui-org/react";
import Image from "next/image";


interface LeftPackageProps {
  data: DataContent;
}

export default function LeftPackage({data}:LeftPackageProps) {
  return (
    <div className="py-16">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="w-full md:w-1/2">
          <Image
            src={data.image}
            alt="Machu Picchu during rainy season"
            width={600}
            height={400}
            className="shadow-lg object-cover h-[400px] w-full md:h-[400px]"
          />
        </div>
        <div className="w-full md:w-1/2 mx-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
           {data.header}
          </h2>
          <p className="text-gray-700 mb-6">
           {data.content}
          </p>
          <Button className="bg-orange-700 hover:bg-orange-600 text-black font-bold py-2 px-3 rounded transition-colors">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
