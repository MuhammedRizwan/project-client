"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { agentBookings, getAgents } from "@/config/admin/authservice";
import Agent from "@/interfaces/agent";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Data Distribution",
    },
  },
};

export default function DoughnutChart() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [bookingData, setBookingData] = useState<{
    bookingcount: number;
    completedbooking: number;
    ongoingbooking: number;
    pendingbooking: number;
    cancelbooking: number;
  } | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAgents();
        setAgents(response.agents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleagent = async (agentId: string) => {
    try {
      const agent = agents.find((agent) => agent._id == agentId);
      setAgent(agent as Agent);
      const response = await agentBookings(agentId);
      setBookingData(response.bookingData);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const data: ChartData<"doughnut"> = {
    labels: bookingData ? Object.keys(bookingData) : [], // Extract keys as labels
    datasets: [
      {
        data: bookingData ? Object.values(bookingData) : [], // Extract values as data
        backgroundColor: [
          "rgba(139, 0, 0, 0.8)",   // Dark Red
          "rgba(0, 0, 0, 0.8)",     // Black
          "rgba(0, 0, 139, 0.8)",   // Dark Blue
          "rgba(47, 79, 79, 0.8)",  // Dark Slate Gray
          "rgba(85, 107, 47, 0.8)", // Dark Olive Green
        ],
        borderColor: [
          "rgba(139, 0, 0, 1)",     // Dark Red
          "rgba(0, 0, 0, 1)",       // Black
          "rgba(0, 0, 139, 1)",     // Dark Blue
          "rgba(47, 79, 79, 1)",    // Dark Slate Gray
          "rgba(85, 107, 47, 1)",   // Dark Olive Green
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-3">
      <CardHeader className="flex justify-between items-start px-4 pt-4">
        <div>
          <h4 className="font-bold text-large">
            {agent?.agency_name ?? "select an agent"}
          </h4>
          <p className="text-tiny uppercase font-bold">Bookings Information</p>
        </div>
        <Dropdown className="bg-zinc-900 text-white">
          <DropdownTrigger>
            <Button variant="bordered">
              {agent?.agency_name ?? "Select Agent"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Agent List"
            className="max-h-40 overflow-y-auto overflow-x-hidden scrollbar-hide"
          >
            {agents &&
              agents.map((agent, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => handleagent(agent._id as string)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={
                        (agent.profile_picture as string) ||
                        "/logos/avatar.avif"
                      } // Replace with the avatar source field
                      size="sm"
                      alt={agent.agency_name}
                    />
                    <span>{agent.agency_name}</span>
                  </div>
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Doughnut data={data} options={options} />
      </CardBody>
    </Card>
  );
}
