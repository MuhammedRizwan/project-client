import Review from "@/interfaces/review";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/16/solid";
import { Avatar, Button, Card, CardBody, Progress } from "@nextui-org/react";
import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewCardProps {
  review: Review[];
  countReview: number;
  countRating: number;
  rating: object;
}

export default function PackageReview({
  review,
  countReview,
  rating,
}: ReviewCardProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const calculatePercentage = (count: number) =>
    countReview ? (count / countReview) * 100 : 0;

  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === review.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === 0 ? review.length - 1 : prevIndex - 1
    );
  };

  const currentReview = review[currentReviewIndex];

  return (
    <div className="py-5 px-16 space-y-8 flex items-center  gap-3">
      <div className="w-full md:w-1/2">
        <Card className="bg-white ">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Avatar
                  src={
                    typeof currentReview.user_id === "object" &&
                    typeof currentReview.user_id.profile_picture === "string"
                      ? currentReview.user_id.profile_picture
                      : "/default-profile.png"
                  }
                  className="mr-3"
                />
                <div>
                  <h3 className="font-semibold text-black">
                    {typeof currentReview.user_id === "object" &&
                      currentReview.user_id.username}
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex items-center my-2">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-4 h-4 ${
                    index < currentReview.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-black"
                  }`}
                />
              ))}
              <p className="ml-2 text-sm text-gray-400">
                {typeof currentReview.user_id === "object" &&
                  currentReview.user_id.email}
              </p>
            </div>
            <p className="text-sm text-black">{currentReview.feedback}</p>
          </div>
        </Card>
        <div className="flex justify-between mt-4">
          <Button onClick={prevReview}>
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <Button onClick={nextReview}>
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <Card className="max-w-[600px] bg-white text-black">
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center mb-2">
                <div className="flex items-center w-20">
                  <span className="mr-1">{stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress
                  aria-label={`${stars} star reviews`}
                  value={calculatePercentage(
                    rating[stars as keyof typeof rating]
                  )}
                  className="max-w-md"
                />
                <span className="ml-4 text-sm">
                  {rating[stars as keyof typeof rating]}
                </span>
              </div>
            ))}
            <p className="mt-4 text-sm text-gray-400">
              {countReview} total reviews
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
