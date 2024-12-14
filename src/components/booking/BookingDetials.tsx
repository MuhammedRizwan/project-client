"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Sun, Moon } from "lucide-react";
import Booking from "@/interfaces/booking";
import Package from "@/interfaces/package";
import axios from "axios";
import toast from "react-hot-toast";
import {
  change_booking_status,
  change_Travel_status,
  fetch_one_booking,
} from "@/config/agent/bookingservice";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const defaultReasons = [
  "Change of plans",
  "Found a better deal",
  "Emergency situation",
  "Unsatisfactory service",
  "Other (please specify)",
];

export default function BookingDetails({
  params,
}: {
  params: { bookingId: string };
}) {
  const userId = useSelector((state: RootState) => state.user.user?._id);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [packages, setPackages] = useState<Package | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTravelConfirmModalOpen, setIsTravelConfirmModalOpen] =
    useState(false);
  const [newBookingStatus, setNewBookingStatus] = useState<
    "pending" | "confirmed" | "canceled" | undefined
  >(undefined);
  const [newTravelStatus, setNewTravelStatus] = useState<
    "pending" | "on-going" | "completed" | "canceled" | undefined
  >(undefined);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch_one_booking(params.bookingId);
        const { booking } = response;
        const packageData =
          typeof booking.package_id === "object" && booking.package_id
            ? booking.package_id
            : null;
        setPackages(packageData);
        setBooking(booking);
        setNewBookingStatus(booking.booking_status);
        setNewTravelStatus(booking.travel_status);
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    };
    fetchBooking();
  }, [params.bookingId]);

  const updateBookingStatus = async () => {
    if (!booking || !newBookingStatus) return;

    try {
      const response = await change_booking_status(params.bookingId, {
        status: newBookingStatus,
        cancellation_reason:
          newBookingStatus === "canceled"
            ? selectedReason === "Other (please specify)"
              ? cancellationReason
              : selectedReason
            : undefined,
      });
      if (response.success) {
        const { changeBookingstatus } = response;
        setBooking((prev) => {
          if (prev) {
            return {
              ...prev,
              booking_status: changeBookingstatus.booking_status,
            };
          }
          return prev;
        });
        toast.success(
          `Booking status updated to ${changeBookingstatus.booking_status}`
        );
        setIsCancelModalOpen(false);
        setIsConfirmModalOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const updateTravelStatus = async () => {
    if (!booking || !newTravelStatus) return;
    try {
      const response = await change_Travel_status(params.bookingId, {
        travel_status: newTravelStatus,
      });

      if (response.success) {
        const { changeTravelstatus } = response;
        setBooking((prev) => {
          if (prev) {
            return {
              ...prev,
              travel_status: changeTravelstatus.travel_status,
            };
          }
          return prev;
        });
        toast.success(
          `Travel status updated to ${changeTravelstatus.travel_status}`
        );
        setIsConfirmModalOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleStatusChange = (status: "confirmed" | "canceled") => {
    if (status === "canceled") {
      setIsCancelModalOpen(true);
    } else {
      setNewBookingStatus(status);
      setIsConfirmModalOpen(true);
    }
  };

  const handleTravelStatusChange = (
    status: "pending" | "on-going" | "completed" | "canceled"
  ) => {
    setNewTravelStatus(status);
    setIsTravelConfirmModalOpen(true);
  };

  const confirmStatusChange = () => {
    updateBookingStatus();
    setIsConfirmModalOpen(false);
  };
  const confirmTravelStatusChange = () => {
    updateTravelStatus();
    setIsTravelConfirmModalOpen(false);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Image
          src={packages?.images[0] || "/placeholder.svg"}
          alt={packages?.package_name || "Package Image"}
          width={200}
          height={150}
          className="rounded-lg"
        />
        <div>
          <h3 className="text-xl font-semibold">{packages?.package_name}</h3>
          <p className="text-sm text-gray-600 mb-2">{packages?.description}</p>
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
        <div className="bg-gray-50 rounded-lg p-4 shadow-md">
          <h4 className="font-semibold text-lg mb-3 text-gray-700">Details</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Guest:</span>
              <div className="text-gray-800">
                {booking?.members.map((guest, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-medium">{guest.name}</span>
                    <span className="text-sm text-gray-500">
                      (Age: {guest.age})
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-gray-700">0</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-gray-800">
                ₹{packages?.offer_price}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Payment:</span>
              <span
                className={`font-medium ${
                  booking?.payment_status === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {booking?.payment_status}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 shadow-md">
          <h4 className="font-semibold text-lg mb-3 text-gray-700">
            Billed To
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-800">
                {booking?.bill_details.first_name}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">
                {booking?.bill_details.email}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Net Amount:</span>
              <span className="font-semibold text-gray-800">
                ₹{booking?.payment_amount}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Confirmation:</span>
              <div className="relative inline-block text-left">
                {userId ? (
                  <p>{booking?.booking_status}</p>
                ) : (
                  booking && (
                    <div className="relative inline-block text-left">
                      {booking.booking_status === "pending" ? (
                        <select
                          value={booking.booking_status}
                          onChange={(e) =>
                            handleStatusChange(
                              e.target.value as "confirmed" | "canceled"
                            )
                          }
                          className="border px-3 py-2 rounded-lg"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="canceled" className="text-red-500">
                            Canceled
                          </option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-2 rounded-lg ${
                            booking.booking_status === "canceled"
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {booking.booking_status.charAt(0).toUpperCase() +
                            booking.booking_status.slice(1)}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Travel Status:</span>
              <span className={`font-medium`}>
                {userId ?(
                  <p>{booking?.travel_status}</p>
                ):(

               booking && (
                  <div className="relative inline-block text-left">
                    {["completed", "canceled"].includes(
                      booking.travel_status
                    ) ? (
                      <span
                        className={`px-3 py-2 rounded-lg ${
                          booking.travel_status === "canceled"
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {booking.travel_status.charAt(0).toUpperCase() +
                          booking.travel_status.slice(1)}
                      </span>
                    ) : (
                      ["pending", "on-going"].includes(
                        booking.travel_status
                      ) && (
                        <select
                          value={booking.travel_status}
                          onChange={(e) =>
                            handleTravelStatusChange(
                              e.target.value as
                                | "pending"
                                | "canceled"
                                | "on-going"
                                | "completed"
                            )
                          }
                          className="border px-3 py-2 rounded-lg"
                        >
                          {booking.travel_status === "pending" && (
                            <>
                              <option value="pending" disabled={true}>
                                Pending
                              </option>
                              <option value="on-going">On-going</option>
                              <option value="canceled" className="text-red-500">
                                Canceled
                              </option>
                            </>
                          )}
                          {booking.travel_status === "on-going" && (
                            <>
                              <option disabled={true}>on-going</option>
                              <option value="completed">Completed</option>
                            </>
                          )}
                        </select>
                      )
                    )}
                  </div>
                )
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedReason("");
          setCancellationReason("");
        }}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cancel Booking
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to cancel this booking?</p>
                <RadioGroup
                  label="Reason for cancellation"
                  value={selectedReason}
                  onValueChange={setSelectedReason}
                >
                  {defaultReasons.map((reason) => (
                    <Radio key={reason} value={reason}>
                      {reason}
                    </Radio>
                  ))}
                </RadioGroup>
                {selectedReason === "Other (please specify)" && (
                  <Textarea
                    label="Please specify your reason"
                    placeholder="Enter your reason for cancellation"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    minRows={2}
                    maxRows={4}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setNewBookingStatus("canceled");
                    updateBookingStatus();
                  }}
                  isDisabled={
                    !selectedReason ||
                    (selectedReason === "Other (please specify)" &&
                      !cancellationReason.trim())
                  }
                >
                  Confirm Cancellation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Status Change
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to change the status to{" "}
                  {newBookingStatus}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={confirmStatusChange}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isTravelConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Status Change
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to change the status to{" "}
                  {newTravelStatus}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={confirmTravelStatusChange}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
