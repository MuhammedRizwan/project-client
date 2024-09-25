'use client'
import Header from "@/components/user/Navbar";
import Hero from "@/components/home/Hero";
import Packages from "@/components/home/Packages";
import Gallery from "@/components/home/Gallery";
import Footer from "@/components/user/Footer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Home() {
  const state=useSelector((state:RootState)=>state.user)  
  return (
    <div>
      <Header />

      <main>
        <Hero />
        <section className="bg-gray-100 py-6">
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
        </section>
        <Packages />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
