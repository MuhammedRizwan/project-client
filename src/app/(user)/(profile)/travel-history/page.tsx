"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Booking from "@/interfaces/booking";
import { BookingCard } from "@/components/booking/BookingCard";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  delete_feedback,
  edit_feedback,
  save_feedback,
} from "@/config/user/reviewservice";
import { completed_travel } from "@/config/user/bookingservice";
import Spinnerpage from "@/app/loading";
import Review from "@/interfaces/review";

export default function TravelBookings() {
  const user = useSelector((state: RootState) => state.user.user);
  const [travelHistory, setTravelHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | undefined>("");
  const [reviewModal, setReviewMoadal] = useState(false);
  const [packageId, setPackageId] = useState<string | undefined>("");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [reviewId, setReviewId] = useState<string | undefined>("");
  const [buttonLoading, setButtonLoading] = useState(false);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await completed_travel(user?._id);
        if (response.success) {
          setTravelHistory(response.travelHistory);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (loading) return <Spinnerpage />;
  const addReviewClick = (bookingId: string, packageId: string | undefined) => {
    setBookingId(bookingId);
    setPackageId(packageId);
    setReviewMoadal(true);
  };

  const editReviewClick = (
    bookingId: string,
    review: Review | string | undefined
  ) => {
    if (typeof review === "object") {
      setReviewId(review._id);
      setRating(review.rating);
      setFeedback(review.feedback);
    }
    setBookingId(bookingId);
    setReviewMoadal(true);
  };
  const handleSaveFeedback = async () => {
    try {
      setButtonLoading(true);
      const user_id = user?._id;
      const package_id = packageId;
      const response = await save_feedback(bookingId, {
        user_id,
        package_id,
        rating,
        feedback,
      });
  
      if (response.success) {
        toast.success(response.message);
        setReviewMoadal(false);
        setRating(0);
        setFeedback("");
        setTravelHistory((prevHistory) =>
          prevHistory.map((booking) =>
            booking._id === bookingId ? response.booking : booking
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setButtonLoading(false);
    }
  };
  
  const handleEditFeedback = async () => {
    setButtonLoading(true);
    try {
      const response = await edit_feedback(reviewId, {
        rating,
        feedback,
      });
      if (response.success) {
        toast.success(response.message);
        setReviewMoadal(false);
        setRating(0);
        setFeedback("");
        setReviewId("");
        setTravelHistory((prevHistory) =>
          prevHistory.map((booking) =>
            booking._id === bookingId
              ? { ...booking, review_id: response.review }
              : booking
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }finally{
      setButtonLoading(false);
    }
  };
  const handleDeleteFeedback = async () => {
    setButtonLoading(true);
    try {
      const response = await delete_feedback(bookingId, reviewId);
      if (response.success) {
        toast.success(response.message);
        setReviewMoadal(false);
        setRating(0);
        setFeedback("");
        setReviewId("");
        setTravelHistory((prevHistory) =>
          prevHistory.map((booking) =>
            booking._id === bookingId ? response.booking : booking
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }finally{
      setButtonLoading(false);
    }
  };
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
            addReview={addReviewClick}
            editReview={editReviewClick}
          />
        ))
      ) : (
        <p>No Packages Found</p>
      )}
      <Modal
        isOpen={reviewModal}
        onClose={() => {
          setReviewMoadal(false);
          setRating(0);
          setFeedback("");
        }}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Feedback
              </ModalHeader>
              <ModalBody>
                <p>Give your feedback for this package</p>
                <div className="flex justify-center space-x-1 my-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <Textarea
                  placeholder="Your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {reviewId && (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleDeleteFeedback}
                  >
                    Delete feedback
                  </Button>
                )}
                <Button
                  color="primary"
                  onPress={() =>
                    reviewId ? handleEditFeedback() : handleSaveFeedback()
                  }
                  isDisabled={!rating || !feedback}
                  isLoading={buttonLoading}
                >
                  {reviewId ? "Edit feedback" : "Save feedback"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
