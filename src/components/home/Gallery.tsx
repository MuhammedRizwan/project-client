import Image from "next/image";

const Gallery = () => {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">Our Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Image src="/gallery-1.jpg" alt="Gallery 1" className="rounded-lg shadow-lg" width={400} height={300}/>
            <Image src="/gallery-2.jpg" alt="Gallery 2" className="rounded-lg shadow-lg" width={400} height={300}/>
            <Image src="/gallery-3.jpg" alt="Gallery 3" className="rounded-lg shadow-lg" width={400} height={300}/>
            <Image src="/gallery-4.jpg" alt="Gallery 4" className="rounded-lg shadow-lg" width={400} height={300}/>
          </div>
        </div>
      </section>
    );
  };
  
  export default Gallery;
  