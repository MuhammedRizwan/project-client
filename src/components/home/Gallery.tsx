import Image from "next/image";

const galleryImages = [
  { src: "/images/gallery_1.jpg", alt: "Beach with palm trees" },
  { src: "/images/homepicture1.jpg", alt: "Balinese-style gate" },
  { src: "/images/Ngabay.webp", alt: "Serene lake with mountains" },
  { src: "/images/Apakunee.webp", alt: "Hot air balloons over a field" },
  { src: "/images/luxury bg-2.webp", alt: "Person overlooking a cityscape" },
  { src: "/images/waikiki.webp", alt: "Person walking through Balinese gate" },
  {
    src: "/images/pikaia.webp",
    alt: "Person on a viewing platform in mountains",
  },
  {
    src: "/images/luxorios bg-1.webp",
    alt: "Person looking at a coastal scene",
  },
];

export default function Gallery() {
  return (
    <div className="bg-navy text-white py-12">
      <div className=" mx-auto px-4">
        {/* Featured Image */}
        <div className="relative flex justify-center mb-12">
          <Image
            src="/images/gallery_1.jpg"
            alt="People jumping on beach at sunset"
            width={1100}
            height={600}
            className=" rounded-lg shadow-lg absolute  z-10" // Positioned to overlap
          />
        </div>

        {/* Header Section */}
        <div className="bg-gray-800 relative mt-96 mb-8 h-[100px] lg:h-[500px] p-8 rounded-lg shadow-md overflow-hidden">
          <div className="absolute bottom-10">
            <h2 className="text-3xl font-bold mb-4">Our Gallery</h2>
          </div>

          {/* Paragraph aligned to bottom */}
          <p className="text-gray-400 absolute bottom-8 left-8 z-20">
            Here are some of our favorite moments.
          </p>

          {/* Button aligned at the top right */}
          <button className="absolute bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-6 rounded transition-colors">
            Open Instagram
          </button>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 bg-black">
          {/* Gallery Images 1 */}
          <div className="col-span-1 row-span-2">
            <Image
              src={galleryImages[0].src}
              alt="People jumping on beach at sunset"
              width={600}
              height={600}
              className=" h-full w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Gallery Images 2 */}
          <div className="col-span-1 row-span-4">
            <Image
              src={galleryImages[1].src}
              alt="Balinese-style gate"
              width={600}
              height={600}
              className="h-full w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Gallery Images 3 */}
          <div className="col-span-1 row-span-1">
            <Image
              src={galleryImages[2].src}
              alt="Serene lake with mountains"
              width={600}
              height={600}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Gallery Images 4 */}
          <div className="col-span-2 row-span-2">
            <Image
              src={galleryImages[3].src}
              alt="Hot air balloons over a field"
              width={600}
              height={600}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Gallery Images 5 */}
          <div className="col-span-1 row-span-3">
            <Image
              src={galleryImages[0].src}
              alt="People jumping on beach at sunset"
              width={600}
              height={600}
              className="h-full w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Gallery Images 6 */}
          <div className="col-span-1 row-span-4">
            <Image
              src={galleryImages[5].src}
              alt="Person walking through Balinese gate"
              width={700}
              height={700}
              className="h-full w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Gallery Images 7 */}
          <div className="col-span-1 row-span-2">
            <Image
              src={galleryImages[6].src}
              alt="Person on a viewing platform in mountains"
              width={1000}
              height={1000}
              className="h-full w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Gallery Images 8 */}
          <div className="col-span-1 row-span-2">
            <Image
              src={galleryImages[7].src}
              alt="Person looking at a coastal scene"
              width={600}
              height={600}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
