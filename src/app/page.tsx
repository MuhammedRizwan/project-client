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
