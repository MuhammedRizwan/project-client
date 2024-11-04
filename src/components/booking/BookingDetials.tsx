'use client'
import Image from 'next/image'
import { User, Sun, Moon, MoreHorizontal } from 'lucide-react';
import Booking from '@/interfaces/booking';
import { useEffect, useState } from 'react';
import Package from '@/interfaces/package';
import axios from 'axios';
import toast from 'react-hot-toast';
import { change_booking_status, fetch_one_booking } from '@/api/agent/bookingservice';


export default function BookingDetails({ params }: { params: { bookingId: string } }) {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [packages, setPackages] = useState<Package | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newBookingStatus, setNewBookingStatus] = useState<"pending" | "confirmed" | "canceled" | "completed" |undefined>(booking?.booking_status);
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                
                const response = await fetch_one_booking(params.bookingId);
                const { booking } = response;
                const packageData =
                    typeof booking.package_id === 'object' && booking.package_id
                        ? booking.package_id
                        : null;
                setPackages(packageData);
                setBooking(booking);
                setNewBookingStatus(booking.booking_status)
            } catch (error) {
                if(axios.isAxiosError(error)){
                    toast.error(error?.response?.data.message)
                }else{
                    toast.error("something went wrong")
                }
            }
        };
        fetchBooking();
    }, [params.bookingId]);

    const updateBookingStatus = async () => {
        try {
           const response= await change_booking_status(params.bookingId, { status: newBookingStatus });
            if(response.success){
                setModalOpen(false);
                const {changeBookingstatus}=response
                setBooking((prev) => {
                    if (prev) {
                      return {
                        ...prev,
                        booking_status:changeBookingstatus.booking_status
                      };
                    }
                    return prev;
                  });
            }
        } catch (error) {
            if(axios.isAxiosError(error)){
                toast.error(error?.response?.data.message)
            }else{
                toast.error("something went wrong")
            }
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Image
                    src={packages?.images[0] || ""}
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
                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        <MoreHorizontal className="mr-2" /> {booking?.booking_status}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Travel Status:</span>
                            <span className="text-red-600">{booking?.travel_status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h3 className="text-lg font-semibold">Change Booking Status</h3>
                        <p className="text-gray-600">Are you sure you want to change the booking status?</p>
                        <div className="mt-4">
                            <select 
                                value={newBookingStatus}
                                onChange={(e) => {
                                    switch (e.target.value) {
                                      case "confirmed":
                                      case "canceled":
                                      case "completed":
                                        setNewBookingStatus(e.target.value as "confirmed" | "canceled" | "completed");
                                        break;
                                      default:
                                        setNewBookingStatus(undefined);
                                        break;
                                    }
                                  }}
                                className="border rounded-md p-2 w-full"
                            >
                                <option value="">Select Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="canceled">Canceled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                                onClick={updateBookingStatus}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
