import Booking from "@/interfaces/booking"; // Ensure the interface is properly defined
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface BookingProps {
  bookings: Booking[]; // Expecting an array of Booking objects as props
}

export default function NewMessage({ bookings }: BookingProps) {
  const router = useRouter();

  return (
    <div className="max-h-[220px] overflow-y-auto border rounded-md scrollbar-hide">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="flex gap-4 items-center p-4 border-b border-gray-200"
        >
          {/* Avatar Section */}
          <div
            className={`w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500`}
          >
            {typeof booking.user_id === "object" && booking.user_id ? (
              <Avatar
                src={
                  (booking.user_id.profile_picture as string) ||
                  "/logos/avatar.avif"
                }
                alt={booking.user_id.username || "User"}
              />
            ) : (
              <Avatar src="/logos/avatar.avif" alt="Unknown User" />
            )}
          </div>

          {/* Booking Details Section */}
          <div className="flex-1 flex justify-between items-center">
            <div>
              {typeof booking.user_id === "object" && (
                <p className="font-medium text-sm">
                  {(booking.user_id?.username as string) || "Unknown User"}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(booking.booking_date).toLocaleDateString('en-GB')}
              </p>
            </div>

            {/* Verify Button */}
            <div>
              <Button
                className="bg-zinc-900 text-white rounded-lg text-xs"
                onClick={() =>
                  router.push(`/agent/bookings/${booking._id}`)
                }
              >
                confirm
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
