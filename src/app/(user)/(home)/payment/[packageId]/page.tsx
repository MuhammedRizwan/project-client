"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  Sun,
  Moon,
  Calendar,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Package from "@/interfaces/package";
import Booking from "@/interfaces/booking";
import { fetch_user_booking } from "@/config/user/bookingservice";

export default function ThankyouPage({
  params,
}: {
  params: { packageId: string };
}) {
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [packageData, setPackageData] = useState<Package | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_user_booking(params.packageId);
        if (response.success) {
          const { booking } = response;
          setBookingData(booking);
          setPackageData(booking.package_id as Package | null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params.packageId]);

  if (!bookingData) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardBody className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="mb-6">
              <h1 className="text-green-600 text-xl font-medium mb-2">
                Thank you for booking with us
              </h1>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {packageData?.package_name}
            </h1>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Destinations
              </h2>
              <ul className="flex justify-center flex-wrap gap-2">
                {packageData?.destinations?.map((destination, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 text-gray-800 py-1 px-3 rounded-md shadow-sm"
                  >
                    {destination}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-700 mb-6 text-lg">
              {packageData?.description}
            </p>

            <div className="flex justify-center flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-blue-50 p-2 rounded-md shadow-sm">
                <User className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-800 font-medium">
                  {packageData?.max_person} Person
                </span>
              </div>
              <div className="flex items-center bg-orange-50 p-2 rounded-md shadow-sm">
                <Sun className="w-6 h-6 text-orange-600 mr-2" />
                <span className="text-gray-800 font-medium">
                  {packageData?.no_of_days} Day
                </span>
              </div>
              <div className="flex items-center bg-purple-50 p-2 rounded-md shadow-sm">
                <Moon className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-gray-800 font-medium">
                  {packageData?.no_of_nights} Night
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center mt-6">
              <CheckCircle size={80} color="green" className="animate-pulse" />
              <p className="text-5xl font-extrabold text-green-600 ml-4">
                Booked
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <Image
              src={packageData?.images[0] || ""}
              alt={packageData?.package_name || ""}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </CardBody>
      </Card>

      <Card className="mb-8 bg-gray-50 shadow-lg rounded-lg overflow-hidden">
  <CardHeader className="bg-orange-600 text-black p-4">
    <h2 className="text-2xl font-bold">Booking Details</h2>
  </CardHeader>
  <Divider />
  <CardBody className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-green-700">
          Personal Information
        </h3>
        <p className="mb-2">
          <strong className="text-gray-800">Name:</strong> {bookingData.bill_details.first_name} {bookingData.bill_details.last_name}
        </p>
        <p className="mb-2">
          <strong className="text-gray-800">Email:</strong> {bookingData.bill_details.email}
        </p>
        <p className="mb-2">
          <strong className="text-gray-800">Phone:</strong> {bookingData.bill_details.phone}
        </p>
        <p className="mb-2">
          <strong className="text-gray-800">Address:</strong> {bookingData.bill_details.address}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-green-700">
          Booking Information
        </h3>
        <p className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-green-500" />
          <strong className="text-gray-800">Start Date:</strong> {new Date(bookingData.start_date).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-green-500" />
          <strong className="text-gray-800">Payment Amount:</strong> ${bookingData.payment_amount}
        </p>
        <p className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <strong className="text-gray-800">Status:</strong> {bookingData.booking_status}
        </p>
      </div>
    </div>
    <Divider className="my-4" />
    <div>
      <h3 className="text-lg font-semibold mb-4 text-green-700">Travel Members</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {bookingData.members.map((member, index) => (
          <div 
          key={index} 
          className="bg-gray-100 text-gray-800 shadow-sm px-3 py-1 rounded-md text-sm border border-gray-200 flex justify-between"
        >
         <p><strong>Name: </strong>{member.name}</p>     <p><strong>Age: </strong>{member.age}</p>  
        </div>
        ))}
      </div>
    </div>
  </CardBody>
</Card>

    </div>
  );
}
