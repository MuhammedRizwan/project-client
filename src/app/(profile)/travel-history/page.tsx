"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstence";
import Booking from "@/interfaces/booking";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import Package from "@/interfaces/package";
import axios from "axios";
import toast from "react-hot-toast";

export default function TravelBookings() {
  const user = useSelector((state: RootState) => state.user.user);
  const [travelHistory, setTravelHistory] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(
          `/booking/travel-history/${user?._id}`
        );
        if (response.status === 200) {
          const { travelHistory } = response.data;
          setTravelHistory(travelHistory);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Failed to fetch bookings");
        }
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (!selectedBooking) return;

    try {
      const response = await axiosInstance.patch(
        `/booking/cancel/${selectedBooking._id}`,
        { booking_status: "cancelled" }
      );
      if (response.status === 200) {
        setTravelHistory((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id
              ? { ...b, booking_status: "cancelled", travel_status: "cancelled", payment_status: "refunded" }
              : b
          )
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to cancel booking");
      }
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg mx-2 px-3">
      <div className="flex justify-between py-5">
        <h1 className="text-2xl font-bold mb-1 text-center">
          Travel Packages from Bookings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        {travelHistory.length > 0 ? (
          travelHistory.map((booking, index) => {
            const pkg = booking.package_id as Package;

            return (
              <Card key={index} className="w-full flex flex-row bg-gray-100">
                <div className="relative h-full w-1/3 p-3">
                  <Image
                    alt={pkg.package_name}
                    src={pkg.images?.[0] || "/default-image.jpg"}
                    className="rounded-l-lg h-48 w-72 object-fill"
                  />
                </div>
                <CardBody className="flex flex-col w-2/3 px-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {pkg.package_name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Max People:{" "}
                      <span className="font-bold">
                        {booking.members.length}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration:{" "}
                      <span className="font-bold">
                        {pkg.no_of_days} Days / {pkg.no_of_nights} Nights
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Travel Status:{" "}
                      <span className="font-bold">{booking.travel_status}</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Destinations:{" "}
                      <span className="font-bold">
                        {pkg.destinations?.join(", ")}
                      </span>
                    </p>
                    <p className="text-lg font-bold text-gray-800 mt-4">
                      Price: ₹{pkg.offer_price}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Start Date:{" "}
                    <span className="font-bold">
                      {new Date(booking.start_date).toLocaleDateString()}
                    </span>
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="mt-2">
                      <h3 className="text-lg font-semibold">Members:</h3>
                      <ul className="list-disc pl-5">
                        {booking.members.map((member, i) => (
                          <li key={i} className="text-sm text-gray-600">
                            {member.name} - {member.age} years old
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Button
                        className={`text-white px-4 py-2 rounded-lg ${
                          booking.booking_status === "cancelled" ||
                          booking.travel_status === "on-going"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-400 hover:bg-yellow-500"
                        }`}
                        disabled={
                          booking.booking_status === "cancelled" ||
                          booking.travel_status === "on-going"
                        }
                        onClick={() => handleCancelClick(booking)}
                      >
                        {booking.booking_status === "cancelled"
                          ? "Cancelled"
                          : "Cancel"}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <p>No Packages Found</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-md max-h-3xl"
      >
        <ModalContent>
          <ModalHeader>Cancel Booking</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to cancel this booking?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmCancellation}>
              Yes, Cancel
            </Button>
            <Button color="primary" onClick={() => setIsModalOpen(false)}>
              No, Keep it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
