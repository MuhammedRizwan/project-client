const Packages = () => {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">Our Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Family Package</h3>
              <p className="text-gray-600">Enjoy a family-friendly vacation with exciting adventures.</p>
            </div>
            <div className="border rounded-lg p-6 shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Luxury Package</h3>
              <p className="text-gray-600">Experience the world in style with our luxury packages.</p>
            </div>
            <div className="border rounded-lg p-6 shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Adventure Package</h3>
              <p className="text-gray-600">Get ready for a thrilling adventure in exotic destinations.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Packages;
  