'use client'
import Header from "@/components/home/Header"
import Hero from "@/components/home/Hero";
import Packages from "@/components/home/Packages";
import Gallery from "@/components/home/Gallery";
import Footer from "@/components/user/Footer";
import LeftPackage from "@/components/home/LeftPackage";
import RightPackage from "@/components/home/RightPackage";
import usePublicProtect from "@/hooks/usePublicProtect";

export default function Home() { 
  usePublicProtect()
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <LeftPackage />
        {/* <section className="bg-gray-100 py-6">
          <div className="flex justify-around text-center text-gray-600">
            <div>
              <h3 className="text-lg font-semibold">March 16, 2024</h3>
            </div>
            <div>
              <h3 className="text-lg font-semibold">02:35 PM</h3>
            </div>
            <div>
              <h3 className="text-lg font-semibold">86°F</h3>
            </div>
          </div>
        </section> */}
        <Packages />
        <RightPackage />
        <LeftPackage/>
        <RightPackage />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
