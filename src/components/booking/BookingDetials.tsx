'use client'
import Image from 'next/image'
import { User, Sun, Moon } from 'lucide-react'
import Booking from '@/interfaces/booking';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstence';
import Package from '@/interfaces/package';

export default function BookingDetails({params}:{params:{bookingId:string}}) {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [packages, setPackages] = useState<Package | null>(null);

    useEffect(()=>{
        const fetchBooking = async () => {
          const response = await axiosInstance.get(`/booking/${params.bookingId}`);
          const { booking } = response.data;
          const packageData = 
          typeof booking.package_id === 'object' && booking.package_id 
            ? booking.package_id 
            : null;
          setPackages(packageData);
          setBooking(booking);
        };
        fetchBooking();
    },[params.bookingId])
  return (
    <div className="w-full  mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Image
          src={packages?.images[0]||""}
          alt={packages?.package_name || ""}
          width={200}
          height={150}
          className="rounded-lg"
        />
        <div>
          <h3 className="text-xl font-semibold">{packages?.package_name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {packages?.description}
          </p>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">₹{packages?.offer_price}</span>
            <div className="flex items-center text-sm text-gray-600">
              <User size={16} className="mr-1" />
              <span>{packages?.max_person} Person</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Sun size={16} className="mr-1" />
              <span>{packages?.no_of_days} Day</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Moon size={16} className="mr-1" />
              <span>{packages?.no_of_nights} Night</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Guest:</span>
              <div>
                {booking?.members.map((guest, index) => (

                    <div key={index}>Name: {guest.name} (Age: {guest.age})</div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span>0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span>{packages?.offer_price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment:</span>
              <span className="text-green-600">{booking?.payment_status}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Billed To</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span>{booking?.bill_details.first_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{booking?.bill_details.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net Amount:</span>
              <span className="font-semibold">{booking?.payment_amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confirmation:</span>
              <button className="bg-green-500 text-white px-3 py-1 rounded">
                Accept
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Travel Status:</span>
              <span className="text-red-600">{booking?.travel_status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
