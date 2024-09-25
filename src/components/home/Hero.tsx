const Hero = () => {
    return (
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/hero-image.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Travel far, explore exotic, and discover your true destination
          </h1>
          <p className="text-lg text-gray-200 mb-8">Explore the beauty of the world with us.</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold">
            Start Your Journey
          </button>
        </div>
      </section>
    );
  };
  
  export default Hero;
  