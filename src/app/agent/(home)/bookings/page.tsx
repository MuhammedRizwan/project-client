"use client";
import { fetch_agent_booking } from "@/api/agent/bookingservice";
import Table, { TableColumn } from "@/components/Table";
import Booking from "@/interfaces/booking";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function BookingsPage() {
  const router = useRouter();
  const { agent } = useSelector((state: RootState) => state.agent);
  const [, setBookings] = useState<Booking[]>([]);
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
              : booking.travel_status === "on-going"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {booking.travel_status}
        </span>
      ),
    },
    {
      key: "_id",
      label: "view detials",
      render: (booking: Booking) => (
        <button
          onClick={() => viewDetialsClick(booking)}
          className={`px-4 py-2 w-32 bg-yellow-700 text-white rounded`}
        >
          view details
        </button>
      ),
    },
  ];

  const viewDetialsClick = (booking: Booking) => {
    router.push(`/agent/bookings/${booking._id}`);
  };
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch_agent_booking(agent?._id);
        if (response.success) {
          const { bookings } = response;
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
  }, [agent?._id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const apiUrl = `/booking/travel-agency/${agent?._id}`;
  return (
    <div>
      <Table<Booking> columns={bookingColumns} apiUrl={apiUrl} />
    </div>
  );
}
