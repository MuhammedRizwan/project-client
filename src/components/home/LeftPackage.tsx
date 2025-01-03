import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function LeftPackage() {
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
            Rainy season is no joke at Machu Picchu
          </h2>
          <p className="text-gray-700 mb-6">
            Located in the Peruvian Andes at nearly 8,000 feet above sea level,
            Machu Picchu cascades down a dramatic mountain spine surrounded by
            the Sacred Valleys jagged peaks. Millions of visitors flock to this
            UNESCO World Heritage site each year to see the terraces and
            classical dry-stone buildings of the citadel. While it is recognized
            as one of the top historic World Heritage sites, Machu Picchu had a
            short life span. It was built by the Incas around 1450 but abandoned
            a century later during the Spanish conquest.
          </p>
          <Button className="bg-orange-700 hover:bg-orange-600 text-black font-bold py-2 px-3 rounded transition-colors">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
