'use client';

import { Image } from '@nextui-org/react';
import { User, Sun, Moon } from 'lucide-react';

interface TravelEntry {
  destination: string;
  image: string;
  persons: number;
  days: number;
  nights: number;
  date: string;
}

const travelHistory: TravelEntry[] = [
  {
    destination: "France, Eiffel Tower",
    image: "/placeholder.svg?height=200&width=300",
    persons: 2,
    days: 2,
    nights: 1,
    date: "20-06-2023",
  },
  {
    destination: "Brazil, Iguazu waterfall",
    image: "/placeholder.svg?height=200&width=300",
    persons: 2,
    days: 2,
    nights: 1,
    date: "24-10-2023",
  },
];

export default function TravelHistory() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Travel History</h2>
      {travelHistory.map((entry, index) => (
        <div
          key={index}
          className="flex bg-white rounded-lg shadow-md overflow-hidden mb-4"
        >
          <div className="w-1/3">
            <Image
              src={entry.image}
              alt={entry.destination}
              width={300}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-2/3 p-4">
            <h3 className="text-xl font-semibold mb-2">{entry.destination}</h3>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{entry.persons}</span>
              </div>
              <div className="flex items-center">
                <Sun className="w-4 h-4 mr-1" />
                <span>{entry.days}</span>
              </div>
              <div className="flex items-center">
                <Moon className="w-4 h-4 mr-1" />
                <span>{entry.nights}</span>
              </div>
            </div>
            <p className="text-gray-500 mt-2">Date: {entry.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
