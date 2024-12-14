"use client";
import { Card, CardBody } from "@nextui-org/react";
import { Users, PlaneTakeoff, HandCoins, Boxes} from "lucide-react";
import { ReviewProgress } from "@/components/dashboard/review-progress";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MetricCardSkeleton } from "@/components/dashboard/metric-card";
import BarGraph from "@/components/dashboard/bargraph";
import { fetchAgentDashboardData } from "@/config/agent/authservice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { ProjectRow } from "@/components/dashboard/project-row";

const MetricCard = dynamic(() => import("@/components/dashboard/metric-card"), {
  loading: () => <MetricCardSkeleton />,
});

export default function Dashboard() {
  const agentId=useSelector((state:RootState)=>state.agent.agent?._id)
  const [packages, setPackages] = useState({
    packagecount: 0,
    unblockedpackage: 0,
  });
  const [booking, setBooking] = useState({
    totalbooking: 0,
    completed: 0,
    ongoing: 0,
    pending: 0,
    cancel: 0,
  });
  const[revenue,setRevenue]=useState<number|null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAgentDashboardData(agentId);
        if (response.success) {
          setPackages(response.packages);
          setBooking(response.booking);
          setRevenue(response.bookingRevenue)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [agentId]);
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Users}
          color="bg-orange-500"
          title="packages Active"
          value={packages.packagecount}
          percentage={`+${Math.floor(
            (packages.unblockedpackage / packages.packagecount) * 100
          )}%`}
          route="/agent/travel-packages"
        />
        <MetricCard
          icon={PlaneTakeoff}
          color="bg-zinc-900"
          title="Booking in Pending"
          value={booking.totalbooking}
          percentage={`+${Math.floor(
            (booking.pending / booking.totalbooking) * 100
          )}%`}
          route=""
        />
        <MetricCard
          icon={Boxes}
          color="bg-zinc-900"
          title="Completed Booking"
          value={booking.completed}
          percentage={`+${Math.floor(
            (booking.completed / booking.totalbooking) * 100
          )}%`}
        />
        <MetricCard
          icon={HandCoins}
          color="bg-zinc-900"
          title="Revenue"
          value={revenue as number}
          percentage="+90%"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-8 mt-5">
                <h2 className="text-xl font-black">Bookings </h2>
                <h3 className="font-black">Total:{booking.totalbooking}</h3>
              </div>
              <ReviewProgress
                label="Bookings completed"
                percentage={Math.floor(
                  (booking.completed/ booking.totalbooking) * 100
                )}
              />
              <ReviewProgress
                label="Bookings Ongoing"
                percentage={Math.floor(
                  (booking.ongoing / booking.totalbooking) * 100
                )}
              />
              <ReviewProgress
                label="Booking Pending"
                percentage={Math.floor(
                  (booking.pending / booking.totalbooking) * 100
                )}
              />
              <ReviewProgress
                label="Booking Canceled"
                percentage={Math.floor(
                  (booking.cancel / booking.totalbooking) * 100
                )}
              />
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardBody>
            <h2 className="text-xl font-black mb-5">New Messages</h2>
              {/* <ConfirmAgent
                key={index}
                color="green"
                description={agent.agency_name as string}
                date= {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString('en-GB'):"N/A"}
                id={agent._id}
                pic={agent.profile_picture}
              /> */}
          </CardBody>
        </Card>
      </div>
      <div>
        <BarGraph/>
      </div>
    </div>
  );
}
