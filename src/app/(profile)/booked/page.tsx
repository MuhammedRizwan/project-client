import { User, Sun, Moon } from 'lucide-react'
import { Button, Image } from '@nextui-org/react';

interface BookedTrip {
  destination: string;
  image: string;
  persons: number;
  days: number;
  nights: number;
  date: string;
}

const bookedTrip: BookedTrip = {
  destination: "Brazil, Iguazu waterfall",
  image: "/placeholder.svg?height=200&width=300",
  persons: 2,
  days: 2,
  nights: 1,
  date: "30-11-2024"
}

export default function BookedTrip() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Booked</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex">
          <div className="w-1/3">
            <Image
              src={bookedTrip.image}
              alt={bookedTrip.destination}
              width={300}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-2/3 p-4">
            <h3 className="text-xl font-semibold mb-2">{bookedTrip.destination}</h3>
            <div className="flex items-center space-x-4 text-gray-600 mb-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{bookedTrip.persons} Person</span>
              </div>
              <div className="flex items-center">
                <Sun className="w-4 h-4 mr-1" />
                <span>{bookedTrip.days} Day</span>
              </div>
              <div className="flex items-center">
                <Moon className="w-4 h-4 mr-1" />
                <span>{bookedTrip.nights} Night</span>
              </div>
            </div>
            <p className="text-gray-500 mb-4">Date: {bookedTrip.date}</p>
            <Button color="secondary" className="bg-sky-400 hover:bg-sky-500 text-white">
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}