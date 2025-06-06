'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import  Category  from '@/interfaces/category'
import { fetch_category } from '@/config/agent/categoryservice'



export default function Packages() {
  const [packages,setPackages]=useState<Category[]>([])
  const [startIndex, setStartIndex] = useState(0)

  useEffect(()=>{
    const fetchCategory=async()=>{
    try {
        const response=await fetch_category()
        if(response.success){
          setPackages(response.categories)
        }
    
    } catch (error) {
      console.log(error);
    }
  }
  fetchCategory()
  },[])

  const handlePrevious = () => {
    setStartIndex((prevIndex) => (prevIndex === 0 ? packages.length - 3 : prevIndex - 1))
  }

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex === packages.length - 3 ? 0 : prevIndex + 1))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Our packages</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat elit
            sed pretium, egestas sed sit.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-black transition-colors"
            aria-label="Previous package"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-orange-500 rounded-full text-black hover:bg-orange-600 transition-colors"
            aria-label="Next package"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.slice(startIndex, startIndex + 3).map((pkg, index) => (
 

          <div key={index} className="bg-white h-80 rounded-lg shadow-md overflow-hidden">
            <Image
              src={pkg.image}
              alt={pkg.category_name}
              width={300}
              height={400}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{pkg.category_name}</h3>
              <p className="text-gray-600 text-sm">{pkg.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}