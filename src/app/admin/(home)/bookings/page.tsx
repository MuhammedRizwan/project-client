"use client";
import Table, { TableColumn } from "@/components/Table";
import Booking from "@/interfaces/booking";
import axiosInstance from "@/lib/axiosInstence";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const bookingColumns: TableColumn<Booking>[] = [
    {
      key: "user_id", // Must match 'keyof Booking'
      label: "Name",
      render: (booking: Booking) =>
        typeof booking.user_id === "object"
          ? booking.user_id.username
          : booking.user_id,
    },
    {
      key: "package_id", // Must match 'keyof Booking'
      label: "Package Name",
      render: (booking: Booking) =>
        typeof booking.package_id === "object"
          ? booking.package_id.package_name
          : booking.package_id,
    },
    {
      key: "travel_agent_id", // Must match 'keyof Booking'
      label: "Travel Agency",
      render: (booking: Booking) =>
        typeof booking.travel_agent_id === "object"
          ? booking.travel_agent_id.agency_name
          : booking.travel_agent_id,
    },
    {
      key: "payment_amount",
      label: "Payment Amount",
    },
    {
      key: "payment_status",
      label: "Payment Status",
      render: (booking: Booking) => (
        <span
          className={`${
            booking.payment_status === "pending"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {booking.payment_status}
        </span>
      ),
    },
    {
      key: "travel_status",
      label: "Travel Status",
      render: (booking: Booking) => (
        <span
          className={`${
            booking.travel_status === "completed"
              ? "text-green-500"
              : booking.travel_status === "in-progress"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {booking.travel_status}
        </span>
      ),
    },
  ];

  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/booking/admin"
        );
        console.log(response.data);
        if (response.status === 200) {
          const { bookings } = response.data;
          setBookings(bookings);
        }
      } catch (error) {
        setError("Error fetching bookings");
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || "Fetching failed";
          toast.error(errorMessage.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Table columns={bookingColumns} data={bookings} />
    </div>
  );
}
