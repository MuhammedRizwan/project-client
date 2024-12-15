"use client";
import { Card, CardBody } from "@nextui-org/react";
import { Users, PlaneTakeoff, HandCoins, Boxes} from "lucide-react";
import { ReviewProgress } from "@/components/dashboard/review-progress";
import { useEffect, useState } from "react";
import { fetchDashboardData, getbarChart } from "@/config/admin/authservice";
import dynamic from "next/dynamic";
import { MetricCardSkeleton } from "@/components/dashboard/metric-card";
import Agent from "@/interfaces/agent";
import ConfirmAgent from "@/components/dashboard/confirmagent";
import BarGraph, { MonthlyDataItem } from "@/components/dashboard/bargraph";
import DoughnutChart from "@/components/dashboard/doughnutchart";
import Wallet from "@/interfaces/wallet";
// import { ProjectRow } from "@/components/dashboard/project-row";

const MetricCard = dynamic(() => import("@/components/dashboard/metric-card"), {
  loading: () => <MetricCardSkeleton />,
});

export default function Dashboard() {
  const [users, setUsers] = useState({ usercount: 0, unblockeduser: 0 });
  const [agent, setAgent] = useState({ agentcount: 0, unblockedagent: 0 });
  const [packages, setPackages] = useState({
    packagecount: 0,
    unblockedpackage: 0,
  });
  const [booking, setBooking] = useState({
    bookingcount: 0,
    completedbooking: 0,
    ongoingbooking: 0,
    pendingbooking: 0,
    cancelbooking: 0,
  });
  const [confirm, setConfirm] = useState<Agent[] | null>(null);
  const [revenue,setRevenue]=useState<Wallet|null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDashboardData();
        if (response.success) {
          setUsers(response.users);
          setAgent(response.agent);
          setPackages(response.packages);
          setBooking(response.bookings);
          setRevenue(response.revenue)
          setConfirm(response.unconfirmedagency);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(()=>{
  const fetchMonthlyData = async () => {
    try {
      const response = await getbarChart();
      if (response.success) {
        setMonthlyData(response.barChartData);
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  fetchMonthlyData();
}, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Users}
          color="bg-orange-500"
          title="Users Active"
          value={users.usercount}
          percentage={`+${Math.floor(
            (users.unblockeduser / users.usercount) * 100
          )}%`}
          route="/admin/user"
        />
        <MetricCard
          icon={PlaneTakeoff}
          color="bg-zinc-900"
          title="Agents Active"
          value={agent.agentcount}
          percentage={`+${Math.floor(
            (agent.unblockedagent / agent.agentcount) * 100
          )}%`}
          route="/admin/travel-agencies"
        />
        <MetricCard
          icon={Boxes}
          color="bg-zinc-900"
          title="Packages Active"
          value={packages.packagecount}
          percentage={`+${Math.floor(
            (packages.unblockedpackage / packages.packagecount) * 100
          )}%`}
        />
        <MetricCard
          icon={HandCoins}
          color="bg-zinc-900"
          title="Revenue"
          value={revenue?.walletBalance as number}
          percentage="+90%"
          route="/admin/wallet"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-8 mt-5">
                <h2 className="text-xl font-black">Bookings </h2>
                <h3 className="font-black">Total:{booking.bookingcount}</h3>
              </div>
              <ReviewProgress
                label="Bookings completed"
                percentage={Math.floor(
                  (booking.completedbooking / booking.bookingcount) * 100
                )}
              />
              <ReviewProgress
                label="Bookings Ongoing"
                percentage={Math.floor(
                  (booking.ongoingbooking / booking.bookingcount) * 100
                )}
              />
              <ReviewProgress
                label="Booking Pending"
                percentage={Math.floor(
                  (booking.pendingbooking / booking.bookingcount) * 100
                )}
              />
              <ReviewProgress
                label="Booking Canceled"
                percentage={Math.floor(
                  (booking.cancelbooking / booking.bookingcount) * 100
                )}
              />
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardBody>
            <h2 className="text-xl font-black mb-5">New Agencies</h2>
            {confirm?.map((agent, index) => (
              <ConfirmAgent
                key={index}
                color="green"
                description={agent.agency_name as string}
                date= {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString('en-GB'):"N/A"}
                id={agent._id}
                pic={agent.profile_picture}
              />
            ))}
          </CardBody>
        </Card>
      </div>
      <div className="flex gap-5 space-y-3">
        <DoughnutChart/>
        <BarGraph data={monthlyData}/>
      </div>
    </div>
  );
}
