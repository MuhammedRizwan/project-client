import BookingDetails from "@/components/booking/BookingDetials";


export default function AgentBookingDetials({params}:{params:{bookingId:string}}) {
  console.log(params)
  return (
    <BookingDetails params={params} />
  )
}