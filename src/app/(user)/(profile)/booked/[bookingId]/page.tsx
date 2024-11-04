import BookingDetails from "@/components/booking/BookingDetials";


export default function UserBookingDetials({params}:{params:{bookingId:string}}) {
  return (
    <BookingDetails params={params} />
  )
}