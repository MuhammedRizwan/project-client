"use client";
import Table, { TableColumn } from "@/components/Table";
import Booking from "@/interfaces/booking";
import { useState } from "react";


export default function BookingsPage() {
  const [booking,setBooking]=useState<Booking[]>([])
  const bookingColumns: TableColumn<Booking>[] = [
    {
      key: "user_id", // Must match 'keyof Booking'
      label: "Name",
      render: (booking: Booking) =>
        typeof booking.user_id === "object"
          ? booking.bill_details.first_name
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
              ? "text-orange-500"
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
              ? "text-orange-500"
              : "text-red-500"
          }`}
        >
          {booking.travel_status}
        </span>
      ),
    },
  ];

  const apiUrl="/booking/admin"

  return (
    <div>
     <Table<Booking> columns={bookingColumns} apiUrl={apiUrl} blockfilter={false} data={booking} setData={setBooking} />
    </div>
  );
}
