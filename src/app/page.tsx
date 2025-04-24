'use client'
import Header from "@/components/home/Header"
import Hero from "@/components/home/Hero";
import Packages from "@/components/home/Packages";
import Gallery from "@/components/home/Gallery";
import Footer from "@/components/user/Footer";
import LeftPackage from "@/components/home/LeftPackage";
import RightPackage from "@/components/home/RightPackage";
import usePublicProtect from "@/hooks/usePublicProtect";
export interface DataContent {
  header: string,
  content: string,
  image: string
}
const amazon = {
  header: "The Amazon",
  content: `Covering roughly 40 percent of South America, including parts of Brazil, Peru, and Colombia, the Amazon 
  is the largest rainforest on the planet, and home to more than 40,000 plant species and 1,300 bird species alone.
   But be sure to visit the winding rivers and diverse wildlife while you can—climate change (along with man-made fires)
    is increasingly whittling away the habitat every day.`,
  image: "/images/Amazon-Getty.webp"
}
const machu = {
  header: "Machu Picchu, Peru",
  content: `Located in the Peruvian Andes at nearly 8,000 feet above sea level,
            Machu Picchu cascades down a dramatic mountain spine surrounded by
            the Sacred Valleys jagged peaks. Millions of visitors flock to this
            UNESCO World Heritage site each year to see the terraces and
            classical dry-stone buildings of the citadel. While it is recognized
            as one of the top historic World Heritage sites, Machu Picchu had a
            short life span. It was built by the Incas around 1450 but abandoned
            a century later during the Spanish conquest.`,
  image: "/images/machu-picchu.jpg"
}
const Lauterbrunnen = {
  header: "Lauterbrunnen, Switzerland",
  content: `The Alpine town of Lauterbrunnen is one of the most beautiful small towns in 
      Europe with its quaint chalet-style houses and village churches. But its natural surroundings are what really 
      steal the show: ooh and ahh at towering rock faces, mountain peaks, flowery meadows, and some of the tallest 
      free-flowing waterfalls in Europe. Fun fact: J.R.R. Tolkien used Lauterbrunnen as inspiration for the fictional
      valley of Rivendell in The Lord of the Rings.`,
  image: "/images/Lauterbrunnen.webp  "
}
const Pitons = {
  header: "The Pitons, St. Lucia",
  content: `The scenery of St. Lucia can be summed up in one jaw-dropping site: a duo of striking spires known as 
the Pitons. The two volcanic peaks—Gros Piton and Petit Piton—are the most iconic landmarks on the island, and visitors 
can enjoy them in a variety of ways. A singular experience has to be actually hiking the mountains, an activity which
 takes the better part of a day. Or, if you prefer to keep your feet at sea level, plop a towel down at Sugar Beach, set 
dramatically (and conveniently) between the two Pitons.`,
  image: "/images/StLucia.webp"
}

export default function Home() {
  usePublicProtect()
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <LeftPackage data={machu} />
        <Packages />
        <RightPackage data={Lauterbrunnen} />
        <LeftPackage data={amazon} />
        <RightPackage data={Pitons} />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
