import { Card, CardBody, Image, Button } from "@nextui-org/react";
import Booking from "@/interfaces/booking";
import Package from "@/interfaces/package";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
  onViewDetails?: (booking: Booking) => void;
}

export const BookingCard = ({
  booking,
  onCancel,
  onViewDetails,
}: BookingCardProps) => {
  const pkg = booking.package_id as Package;

  return (
    <Card className="w-full flex flex-row bg-gray-100 my-2">
      <div className="relative h-full w-1/3 p-3">
        <Image
          alt={pkg.package_name}
          src={pkg.images?.[0] || "/default-image.jpg"}
          className="rounded-l-lg h-48 w-72 object-fill"
        />
      </div>
      <CardBody className="flex flex-col w-2/3 px-4">
        <h2 className="text-xl font-semibold mb-2">{pkg.package_name}</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Peoples: <span className="font-bold">{booking.members.length}</span>
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
            <span className="font-bold">{pkg.destinations?.join(", ")}</span>
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
          <p className="text-sm text-gray-600">
            Biiled To:{" "}
            <span className="font-bold">
              {booking.bill_details.first_name}{" "}
              {booking.bill_details.first_name}
            </span>
          </p>
          <div>
          {onCancel &&(
            <Button
            className={`text-white px-4 py-2 rounded-lg ${
              booking.booking_status === "canceled"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
            disabled={booking.booking_status === "canceled"}
            onClick={() => onCancel(booking)}
          >
            {booking.booking_status === "canceled" ? "Canceled" : "Cancel"}
          </Button>
          )}
          {onViewDetails && (
            <Button
              className="bg-blue-500 text-white px-4 ms-3 py-2 rounded-lg hover:bg-blue-600" 
              onClick={() => onViewDetails(booking)} 
            >
              View Details
            </Button>
          )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
