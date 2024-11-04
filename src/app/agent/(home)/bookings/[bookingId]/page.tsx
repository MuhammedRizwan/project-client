import BookingDetails from "@/components/booking/BookingDetials";


export default function AgentBookingDetials({params}:{params:{bookingId:string}}) {
  return (
    <BookingDetails params={params} />
  )
}