"use client";
import { fetch_agent_booking } from "@/api/agent/bookingservice";
import { BookingCard } from "@/components/booking/BookingCard";
import SearchInput from "@/components/searchInput";
import Booking from "@/interfaces/booking";
import { RootState } from "@/store/store";
import { Pagination } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function BookingByPackages({
  params,
}: {
  params: { packageId: string };
}) {
  const agent = useSelector((state: RootState) => state.agent.agent);
  const router = useRouter();
  const [booking, setBooking] = useState<Booking[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState<string>("");
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch_agent_booking(
          agent?._id,
          params.packageId,
          searchTerm,
          currentPage,
          itemsPerPage
        );
        if (response.success) {
          const {bookingData,totalPages} = response
          setBooking(bookingData);
          setTotalPages(totalPages);
        }
      } catch (error) {
        toast.error(
          axios.isAxiosError(error)
            ? error.response?.data.message
            : "Failed to fetch bookings"
        );
      }
    };
    fetchBookings();
  }, [params.packageId, agent?._id, searchTerm, currentPage]);
 
  const handleViewDetails = (booking: Booking) => {
    router.push(`/agent/bookings/${booking._id}`);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg mx-2 px-3">
      <h1 className="text-2xl font-bold mb-5 text-center">
        Travel Packages from Bookings
      </h1>
      <div>
      <SearchInput
            onSearch={setSearchTerm}
          />
      </div>
      {booking && booking.length > 0 ? (
        booking.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onViewDetails={handleViewDetails}
          />
        ))
      ) : (
        <p>No Packages Found</p>
      )}
    
      <div className="flex justify-center items-center mt-4">
        <Pagination
          showControls
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
