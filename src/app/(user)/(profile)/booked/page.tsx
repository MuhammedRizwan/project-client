'use client'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Booking from "@/interfaces/booking";
import { user_booking, cancel_booking } from "@/config/user/bookingservice";
import toast from "react-hot-toast";
import axios from "axios";
import { BookingCard } from "@/components/booking/BookingCard";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const defaultReasons = [
  "Change of plans",
  "Found a better deal",
  "Emergency situation",
  "Unsatisfactory service",
  "Other (please specify)"
]
export default function TravelBookings() {
  const router=useRouter()
  const user = useSelector((state: RootState) => state.user.user);
  const [travelHistory, setTravelHistory] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("")
  const [selectedReason, setSelectedReason] = useState("")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await user_booking(user?._id);
        if (response.success) {
          setTravelHistory(response.travelHistory);
        }
      } catch (error) {
       console.log(error);
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
    setSelectedReason("")
    setCancellationReason("")
  }

  const confirmCancellation = async () => {
    if (!selectedBooking) return
    const finalReason = selectedReason === "Other (please specify)" ? cancellationReason : selectedReason

    if (!finalReason.trim()) {
      toast.error("Please provide a reason for cancellation")
      return
    }
    try {
      const response = await cancel_booking(selectedBooking._id, {
        booking_status: "canceled",
        cancellation_reason: finalReason
      });
      if (response.success) {
        setTravelHistory((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id
              ? {
                  ...b,
                  booking_status: "canceled",
                  travel_status: "canceled",
                  payment_status: "refunded",
                }
              : b
          )
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data.message
          : "Failed to cancel booking"
      );
    }
  };
  const onviewDetails=(booking:Booking)=>{
    router.push(`/booked/${booking._id}`)
  }

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg mx-2 px-3">
      <h1 className="text-2xl font-bold mb-5 text-center">
        Travel Packages from Bookings
      </h1>
      {travelHistory.length > 0 ? (
        travelHistory.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancel={handleCancelClick}
            onViewDetails={onviewDetails}
          />
        ))
      ) : (
        <p>No Packages Found</p>
      )}
     <Modal 
         isOpen={isModalOpen} 
         onClose={() => {
           setIsModalOpen(false)
           setSelectedReason("")
           setCancellationReason("")
         }}
         size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cancel Booking</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to cancel this booking?</p>
                <RadioGroup
                  label="Reason for cancellation"
                  value={selectedReason}
                  onValueChange={setSelectedReason}
                >
                  {defaultReasons.map((reason) => (
                    <Radio key={reason} value={reason}>{reason}</Radio>
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
                  onPress={confirmCancellation}
                  isDisabled={!selectedReason || (selectedReason === "Other (please specify)" && !cancellationReason.trim())}
                >
                  Confirm Cancellation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
